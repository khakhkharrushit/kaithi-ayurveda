const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalToken, authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require('../mailer');

// Create new order (Authentication required)
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      state,
      pincode,
      items,
      subtotal,
      discount_amount,
      coupon_code,
      shipping_fee,
      total_amount,
      payment_method,
      payment_status,
      razorpay_order_id,
      razorpay_payment_id,
      notes
    } = req.body;

    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !items || !items.length) {
      return res.status(400).json({ error: 'Missing required shipping or items information' });
    }

    const order_number = 'KA-' + Math.floor(100000 + Math.random() * 900000);
    const user_id = req.user ? req.user.id : null;

    const createOrderTx = db.transaction(() => {
      const orderStmt = db.prepare(`
        INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          shipping_address, city, state, pincode, subtotal, discount_amount, coupon_code,
          shipping_fee, total_amount, payment_method, payment_status, razorpay_order_id,
          razorpay_payment_id, order_status, notes
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, 'Placed', ?
        )
      `);

      const result = orderStmt.run(
        order_number,
        user_id,
        customer_name.trim(),
        customer_email.toLowerCase().trim(),
        customer_phone.trim(),
        shipping_address.trim(),
        city || '',
        state || '',
        pincode || '',
        subtotal || 0,
        discount_amount || 0,
        coupon_code || null,
        shipping_fee || 0,
        total_amount,
        payment_method || 'razorpay',
        payment_status || 'paid',
        razorpay_order_id || null,
        razorpay_payment_id || null,
        notes || null
      );

      const orderId = result.lastInsertRowid;

      const itemStmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image, weight)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        itemStmt.run(
          orderId,
          item.product_id || item.id,
          item.product_name || item.name,
          item.price,
          item.quantity,
          item.image || '',
          item.weight || ''
        );
      }

      return orderId;
    });

    const orderId = createOrderTx();

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    const fullOrder = { ...createdOrder, items: orderItems };

    // Fire-and-forget order confirmation email
    sendOrderConfirmationEmail(fullOrder).catch(err =>
      console.warn('Order confirmation email failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: fullOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get user orders (for logged-in customer)
router.get('/my-orders', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? OR customer_email = ? 
      ORDER BY created_at DESC
    `).all(req.user.id, req.user.email);

    const ordersWithItems = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Admin stats
router.get('/admin/stats', requireAdmin, (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'").get().total;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('Placed', 'Processing')").get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count;
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalProducts,
      totalCustomers
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch admin stats' });
  }
});

// Admin get all orders
router.get('/', requireAdmin, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    const ordersWithItems = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Get single order with items (by ID or order_number, public/authenticated)
router.get('/:idOrNumber', (req, res) => {
  try {
    const { idOrNumber } = req.params;
    let order;
    if (isNaN(idOrNumber)) {
      order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(idOrNumber);
    } else {
      order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(idOrNumber, idOrNumber);
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    res.json({
      ...order,
      items
    });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Admin update order status
router.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, tracking_number } = req.body;

    if (!order_status) {
      return res.status(400).json({ error: 'Order status is required' });
    }

    db.prepare(`
      UPDATE orders
      SET order_status = ?,
          tracking_number = COALESCE(?, tracking_number)
      WHERE id = ?
    `).run(order_status, tracking_number || null, id);

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);

    // Fire-and-forget status update email to customer
    sendOrderStatusEmail({ ...updatedOrder, items }).catch(err =>
      console.warn('Status update email failed:', err.message)
    );

    res.json({
      message: `Order status updated to ${order_status}`,
      order: {
        ...updatedOrder,
        items
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;

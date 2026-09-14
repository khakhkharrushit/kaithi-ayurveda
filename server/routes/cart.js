const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Helper to format cart item rows
function formatCartRows(rows) {
  return rows.map(r => {
    let images = [];
    try {
      images = typeof r.images === 'string' ? JSON.parse(r.images) : r.images;
    } catch {
      images = [];
    }
    const primaryImage = Array.isArray(images) && images.length > 0 ? images[0] : (typeof images === 'string' ? images : '');

    return {
      id: r.product_id,
      name: r.name,
      price: r.price,
      mrp: r.mrp,
      weight: r.weight,
      category: r.category,
      image: primaryImage,
      quantity: r.quantity
    };
  });
}

// GET /api/cart — Get user's persistent cart items
router.get('/', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT c.product_id, c.quantity, p.name, p.price, p.mrp, p.weight, p.category, p.images
      FROM user_cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `).all(req.user.id);

    const items = formatCartRows(rows);
    res.json({ items });
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart/sync — Sync / Merge local cart into user's database cart
router.post('/sync', authenticateToken, (req, res) => {
  try {
    const { items } = req.body; // Array of { id, quantity }
    const userId = req.user.id;

    if (Array.isArray(items) && items.length > 0) {
      const upsertStmt = db.prepare(`
        INSERT INTO user_cart_items (user_id, product_id, quantity, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, product_id) DO UPDATE SET
          quantity = excluded.quantity,
          updated_at = CURRENT_TIMESTAMP
      `);

      const syncTransaction = db.transaction((cartItems) => {
        for (const item of cartItems) {
          if (item && item.id && item.quantity > 0) {
            upsertStmt.run(userId, item.id, item.quantity);
          }
        }
      });

      syncTransaction(items);
    }

    // Return the full synced cart
    const rows = db.prepare(`
      SELECT c.product_id, c.quantity, p.name, p.price, p.mrp, p.weight, p.category, p.images
      FROM user_cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `).all(userId);

    res.json({ items: formatCartRows(rows) });
  } catch (err) {
    console.error('Sync cart error:', err);
    res.status(500).json({ error: 'Failed to sync cart' });
  }
});

// POST /api/cart/item — Add or update a single item in user's cart
router.post('/item', authenticateToken, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    db.prepare(`
      INSERT INTO user_cart_items (user_id, product_id, quantity, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, product_id) DO UPDATE SET
        quantity = excluded.quantity,
        updated_at = CURRENT_TIMESTAMP
    `).run(userId, productId, quantity);

    res.json({ success: true });
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).json({ error: 'Failed to update item in cart' });
  }
});

// DELETE /api/cart/item/:productId — Remove single product from user's cart
router.delete('/item/:productId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);

    db.prepare(`
      DELETE FROM user_cart_items
      WHERE user_id = ? AND product_id = ?
    `).run(userId, productId);

    res.json({ success: true });
  } catch (err) {
    console.error('Remove cart item error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// DELETE /api/cart — Clear entire user cart (e.g. after order placed)
router.delete('/', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM user_cart_items WHERE user_id = ?').run(req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;

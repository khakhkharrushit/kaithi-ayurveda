const express = require('express');
const router = express.Router();
const crypto = require('crypto');
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  Razorpay = null;
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_kaithi_demo_key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_ayurveda_demo';

let razorpayInstance = null;
if (Razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } catch (err) {
    console.warn('Razorpay init warning:', err.message);
  }
}

// Get public config for frontend
router.get('/config', (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_kaithi_demo',
    isLiveOrTestConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
    currency: 'INR'
  });
});

// Create an order instance
router.post('/create-order', async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {}
      };

      const order = await razorpayInstance.orders.create(options);
      return res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        mode: 'razorpay'
      });
    }

    // Demo / Sandbox instant mode
    const mockOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    res.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      mode: 'test_simulation',
      message: 'Running in Instant Ayurvedic Test Payment Mode'
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: error.message || 'Failed to initialize payment' });
  }
});

// Verify payment signature
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mode } = req.body;

    if (mode === 'test_simulation' || !process.env.RAZORPAY_KEY_SECRET) {
      // Approved test payment
      return res.json({
        verified: true,
        paymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
        message: 'Payment verified successfully (Test Mode)'
      });
    }

    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      res.json({
        verified: true,
        paymentId: razorpay_payment_id,
        message: 'Payment verified successfully via Razorpay'
      });
    } else {
      res.status(400).json({ verified: false, error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;

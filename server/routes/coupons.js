const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/validate', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = ? AND active = 1')
      .get(code.trim().toUpperCase());

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    if (subtotal < coupon.min_order) {
      return res.status(400).json({
        error: `Coupon requires a minimum order of ₹${coupon.min_order}. Current subtotal is ₹${subtotal}.`
      });
    }

    let discount = 0;
    if (coupon.discount_percent) {
      discount = Math.round((subtotal * coupon.discount_percent) / 100);
    } else if (coupon.discount_flat) {
      discount = coupon.discount_flat;
    }

    // Discount cannot exceed subtotal
    discount = Math.min(discount, subtotal);

    res.json({
      valid: true,
      code: coupon.code,
      discount_amount: discount,
      message: `Coupon ${coupon.code} applied! Saved ₹${discount}.`
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

module.exports = router;

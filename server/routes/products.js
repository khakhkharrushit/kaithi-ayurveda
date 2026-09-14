const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalToken } = require('../middleware/auth');

function formatProduct(row) {
  if (!row) return null;
  return {
    ...row,
    ingredients: JSON.parse(row.ingredients || '[]'),
    benefits: JSON.parse(row.benefits || '[]'),
    images: JSON.parse(row.images || '[]'),
    certifications: JSON.parse(row.certifications || '[]'),
  };
}

// Get all products with optional filters
router.get('/', (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = 'SELECT * FROM products WHERE is_active = 1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      query += ' AND (name LIKE ? OR short_desc LIKE ? OR description LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else {
      query += ' ORDER BY id ASC';
    }

    const rows = db.prepare(query).all(...params);
    res.json(rows.map(formatProduct));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product with reviews
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = formatProduct(row);
    const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(req.params.id);

    res.json({
      ...product,
      reviews: reviews,
      reviews_list: reviews
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Submit a review
router.post('/:id/reviews', optionalToken, (req, res) => {
  try {
    const productId = req.params.id;
    const { user_name, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and review comment are required' });
    }

    const name = (req.user && req.user.name) || user_name || 'Ayurveda Connoisseur';
    const userId = req.user ? req.user.id : null;

    db.prepare(`
      INSERT INTO reviews (product_id, user_id, user_name, rating, comment, verified_buyer)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(productId, userId, name, parseInt(rating, 10), comment.trim());

    // Recalculate average rating & reviews count
    const stats = db.prepare(`
      SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ?
    `).get(productId);

    const newAvg = stats.avg_rating ? parseFloat(stats.avg_rating.toFixed(1)) : 5.0;
    db.prepare('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?')
      .run(newAvg, stats.count, productId);

    const updatedReviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(productId);
    res.status(201).json({
      message: 'Review submitted successfully!',
      reviews_list: updatedReviews,
      new_rating: newAvg,
      new_reviews_count: stats.count
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Ensure DB is initialized
require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static brand product images from assets directory
const assetsPath = path.join(__dirname, '..', 'assets');
app.use('/assets', express.static(assetsPath));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/cart', require('./routes/cart'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Kaithi Ayurveda',
    time: new Date().toISOString()
  });
});

// Serve frontend build if exists
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// Fallback for SPA routing
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.url.startsWith('/api') || req.url.startsWith('/assets')) {
    return next();
  }
  const indexHtml = path.join(clientDist, 'index.html');
  if (require('fs').existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`🌿 Kaithi Ayurveda API Server running on port ${PORT}`);
  console.log(`   - Static assets: http://localhost:${PORT}/assets/`);
  console.log(`   - Health check:  http://localhost:${PORT}/api/health`);
});

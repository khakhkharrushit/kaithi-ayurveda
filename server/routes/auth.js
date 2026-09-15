const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');
const { sendOtpEmail } = require('../mailer');
const nodemailer = require('nodemailer');

// Diagnostic endpoint to test email engine (Resend HTTPS + SMTP)
router.get('/test-smtp', async (req, res) => {
  const user = (process.env.SMTP_USER || 'khakhkharrushit@gmail.com').trim();
  const resendKey = (process.env.RESEND_API_KEY || '').trim();

  const results = {
    resend_configured: !!resendKey,
    smtp_user: user
  };

  // Test Resend HTTPS
  if (resendKey) {
    try {
      const fromAddress = process.env.RESEND_FROM || 'Kaithi Ayurveda <onboarding@resend.dev>';
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [user],
          subject: '⚡ Kaithi Ayurveda — Email Engine Live Test',
          html: '<h3>Namaste! 🙏</h3><p>Your Kaithi Ayurveda HTTPS email engine is live and working perfectly on Render!</p>'
        })
      });
      const resData = await resendRes.json();
      if (resendRes.ok) {
        results.resend_status = 'SUCCESS';
        results.resend_email_id = resData.id;
      } else {
        results.resend_status = 'ERROR';
        results.resend_error = resData;
      }
    } catch (e) {
      results.resend_status = 'NETWORK_ERROR';
      results.resend_error = e.message;
    }
  }

  res.json({
    status: results.resend_status === 'SUCCESS' ? 'ONLINE_ACTIVE' : 'CHECK_CONFIG',
    provider: results.resend_status === 'SUCCESS' ? 'Resend HTTPS API' : 'SMTP Fallback',
    results
  });
});

// Register a new customer
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, pincode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, address, city, state, pincode, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'customer')
    `);

    const result = stmt.run(
      name.trim(),
      email.toLowerCase().trim(),
      password_hash,
      phone || '',
      address || '',
      city || '',
      state || '',
      pincode || ''
    );

    const user = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      role: 'customer'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user, message: 'Account created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRecord = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, userRecord.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      address: userRecord.address,
      city: userRecord.city,
      state: userRecord.state,
      pincode: userRecord.pincode,
      role: userRecord.role
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Send OTP to email
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    db.prepare(`
      INSERT INTO email_otps (email, otp, expires_at)
      VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET otp = excluded.otp, expires_at = excluded.expires_at
    `).run(cleanEmail, otp, expiresAt);

    // Send real email via mailer asynchronously (never blocks the UI)
    sendOtpEmail(cleanEmail, otp).catch(mailErr => {
      console.warn('Email delivery failed:', mailErr.message);
    });

    res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      // Only expose OTP in non-production so devs can test without email
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send verification code. Please try again.' });
  }
});

// Verify Email OTP and Sign In / Register
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const record = db.prepare('SELECT * FROM email_otps WHERE email = ?').get(cleanEmail);

    if (!record || record.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (Date.now() > record.expires_at) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Clear used OTP
    db.prepare('DELETE FROM email_otps WHERE email = ?').run(cleanEmail);

    // Check if user exists or create new
    let userRecord = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
    if (!userRecord) {
      const defaultName = (name && name.trim()) || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const randomPass = Math.random().toString(36).substring(2, 12);
      const password_hash = bcrypt.hashSync(randomPass, 10);

      const stmt = db.prepare(`
        INSERT INTO users (name, email, password_hash, role, address, city, state, pincode)
        VALUES (?, ?, ?, 'customer', 'Ravi Complex, Avni Apartment', 'Kodinar', 'Gujarat', '362720')
      `);
      const result = stmt.run(defaultName, cleanEmail, password_hash);

      userRecord = {
        id: result.lastInsertRowid,
        name: defaultName,
        email: cleanEmail,
        phone: '',
        address: '',
        city: 'Kodinar',
        state: 'Gujarat',
        pincode: '362720',
        role: 'customer'
      };
    }

    const user = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone || '',
      address: userRecord.address || '',
      city: userRecord.city || 'Kodinar',
      state: userRecord.state || 'Gujarat',
      pincode: userRecord.pincode || '362720',
      role: userRecord.role || 'customer'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user, message: 'Verified & Logged in successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Real Google Sign-In — verifies credential token from Google Identity Services
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential token missing' });
    }

    // Verify the Google ID token
    const { OAuth2Client } = require('google-auth-library');
    const clientId = process.env.GOOGLE_CLIENT_ID || '656605900168-sge1peb9qlioanomlmt143l9nfiie4ct.apps.googleusercontent.com';
    const googleClient = new OAuth2Client(clientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google account' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let userRecord = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!userRecord) {
      const defaultName = (name && name.trim()) || cleanEmail.split('@')[0].replace(/\b\w/g, l => l.toUpperCase());
      const randomPass = Math.random().toString(36).substring(2, 12);
      const password_hash = bcrypt.hashSync(randomPass, 10);

      const stmt = db.prepare(`
        INSERT INTO users (name, email, password_hash, role, address, city, state, pincode)
        VALUES (?, ?, ?, 'customer', '', 'Kodinar', 'Gujarat', '362720')
      `);
      const result = stmt.run(defaultName, cleanEmail, password_hash);

      userRecord = {
        id: result.lastInsertRowid,
        name: defaultName,
        email: cleanEmail,
        phone: '',
        address: '',
        city: 'Kodinar',
        state: 'Gujarat',
        pincode: '362720',
        role: 'customer'
      };
    }

    const user = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone || '',
      address: userRecord.address || '',
      city: userRecord.city || 'Kodinar',
      state: userRecord.state || 'Gujarat',
      pincode: userRecord.pincode || '362720',
      role: userRecord.role || 'customer'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user, message: 'Signed in with Google successfully' });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ error: 'Google sign-in verification failed. Please try again.' });
  }
});

// Current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, address, city, state, pincode, role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Update profile / address
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;
    db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          city = COALESCE(?, city),
          state = COALESCE(?, state),
          pincode = COALESCE(?, pincode)
      WHERE id = ?
    `).run(name, phone, address, city, state, pincode, req.user.id);

    const updated = db.prepare('SELECT id, name, email, phone, address, city, state, pincode, role FROM users WHERE id = ?').get(req.user.id);
    const token = jwt.sign(updated, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: updated, token, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

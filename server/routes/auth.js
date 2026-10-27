const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sojib_portfolio_jwt_secret_2026_secure';
const MASTER_EMAIL = process.env.ADMIN_EMAIL || 'sojibahmedshorif25@gmail.com';
const MASTER_PASS = process.env.ADMIN_PASSWORD || 'Sojibboss@321646##';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(MASTER_PASS, 10);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    // If email is provided, verify email match
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const validEmails = [
        MASTER_EMAIL.toLowerCase(),
        'sojibahmedshorif25@gmail.com',
        'sojibahmedshorif998@gmail.com',
      ];
      if (!validEmails.includes(cleanEmail)) {
        return res.status(401).json({ success: false, message: 'Invalid admin email address' });
      }
    }

    let isValid = false;

    // Check bcrypt hash
    try {
      isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } catch {}

    // Check direct password match
    if (!isValid) {
      if (
        password === MASTER_PASS ||
        password === 'Sojibboss@321646##' ||
        password === 'Sojib@2026!Secure' ||
        password === 'sojib@admin2026'
      ) {
        isValid = true;
      }
    }

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Incorrect admin password' });
    }

    const token = jwt.sign(
      { role: 'admin', email: MASTER_EMAIL, name: 'Sojib Ahmed' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, message: 'Admin authenticated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
});

// GET /api/auth/verify (Check if current token is valid)
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user, message: 'Token valid' });
});

module.exports = router;

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const SALT_ROUNDS = 10;

// ─── Register ────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password, role = 'patient' } = req.body;

  // 1. Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const allowedRoles = ['patient', 'doctor', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    // 2. Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 3. Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, password_hash, role]
    );

    const user = result.rows[0];

    // 5. Issue JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ user, token });

  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── Login ───────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // 2. Compare password with stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Issue JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Return user (never return password_hash)
    const { password_hash, ...safeUser } = user;
    return res.status(200).json({ user: safeUser, token });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };
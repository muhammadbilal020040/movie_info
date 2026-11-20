const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
}

async function me(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at FROM admins WHERE id = ? LIMIT 1',
      [req.admin.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    return res.json({ data: rows[0] });
  } catch (err) {
    console.error('me error', err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = { login, me };

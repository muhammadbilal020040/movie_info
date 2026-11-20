const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const genreRoutes = require('./routes/genres');
const movieRoutes = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // allow local student demo origins
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      student: 'Muhammad Bilal',
      studentId: '22501-3251014-',
      topic: 39,
    });
  } catch {
    res.status(500).json({ status: 'error', message: 'Database connection failed.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/movies', movieRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Poster must be 2MB or smaller.' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message && err.message.includes('Only JPG')) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Movie Info API running on http://localhost:${PORT}`);
  console.log('Student: Muhammad Bilal | 22501-3251014- | Topic 39');
});

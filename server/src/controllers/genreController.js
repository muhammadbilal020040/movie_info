const pool = require('../config/db');

async function listGenres(_req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT g.*, COUNT(mg.movie_id) AS movie_count
       FROM genres g
       LEFT JOIN movie_genres mg ON mg.genre_id = g.id
       GROUP BY g.id
       ORDER BY g.name`
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load genres.' });
  }
}

async function getGenre(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM genres WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Genre not found.' });
    }
    return res.json({ data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load genre.' });
  }
}

async function createGenre(req, res) {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO genres (name, description) VALUES (?, ?)',
      [name.trim(), description || null]
    );
    const [rows] = await pool.query('SELECT * FROM genres WHERE id = ?', [result.insertId]);
    return res.status(201).json({ message: 'Genre created.', data: rows[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Genre name already exists.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Failed to create genre.' });
  }
}

async function updateGenre(req, res) {
  try {
    const { name, description } = req.body;
    const [existing] = await pool.query('SELECT id FROM genres WHERE id = ?', [req.params.id]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Genre not found.' });
    }
    await pool.query('UPDATE genres SET name = ?, description = ? WHERE id = ?', [
      name.trim(),
      description || null,
      req.params.id,
    ]);
    const [rows] = await pool.query('SELECT * FROM genres WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Genre updated.', data: rows[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Genre name already exists.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Failed to update genre.' });
  }
}

async function deleteGenre(req, res) {
  try {
    const [existing] = await pool.query('SELECT id FROM genres WHERE id = ?', [req.params.id]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Genre not found.' });
    }
    const [used] = await pool.query(
      'SELECT COUNT(*) AS cnt FROM movie_genres WHERE genre_id = ?',
      [req.params.id]
    );
    if (used[0].cnt > 0) {
      return res.status(400).json({
        message: `Genre is used by ${used[0].cnt} movie(s). Remove it from those movies first.`,
      });
    }
    await pool.query('DELETE FROM genres WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Genre deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete genre.' });
  }
}

module.exports = {
  listGenres,
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};

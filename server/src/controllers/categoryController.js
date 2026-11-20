const pool = require('../config/db');

async function listCategories(_req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(m.id) AS movie_count
       FROM categories c
       LEFT JOIN movies m ON m.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name`
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load categories.' });
  }
}

async function getCategory(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.json({ data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load category.' });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name.trim(), description || null]
    );
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    return res.status(201).json({ message: 'Category created.', data: rows[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Category name already exists.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Failed to create category.' });
  }
}

async function updateCategory(req, res) {
  try {
    const { name, description } = req.body;
    const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [req.params.id]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    await pool.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [
      name.trim(),
      description || null,
      req.params.id,
    ]);
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Category updated.', data: rows[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Category name already exists.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Failed to update category.' });
  }
}

async function deleteCategory(req, res) {
  try {
    const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [req.params.id]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    const [used] = await pool.query(
      'SELECT COUNT(*) AS cnt FROM movies WHERE category_id = ?',
      [req.params.id]
    );
    if (used[0].cnt > 0) {
      return res.status(400).json({
        message: `Category is used by ${used[0].cnt} movie(s). Reassign or delete those movies first.`,
      });
    }
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Category deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete category.' });
  }
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

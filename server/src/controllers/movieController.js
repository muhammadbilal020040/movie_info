const pool = require('../config/db');
const { deletePosterFile, toPublicPosterPath } = require('../utils/files');
const {
  attachGenres,
  parseGenreIds,
  searchExact,
  searchRelevant,
} = require('../utils/movies');

async function listMovies(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const categoryId = req.query.category_id ? Number(req.query.category_id) : null;
    const genreIds = parseGenreIds(req.query.genre_ids);
    const hasFilters = Boolean(q || categoryId || genreIds.length);

    if (!hasFilters) {
      const [rows] = await pool.query(
        `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
                m.created_at, m.updated_at, c.name AS category_name
         FROM movies m
         JOIN categories c ON c.id = m.category_id
         ORDER BY m.release_date DESC, m.title ASC`
      );
      const data = await attachGenres(rows);
      return res.json({ exactMatch: true, message: null, data });
    }

    const exact = await searchExact({
      q: q || null,
      categoryId: categoryId && Number.isInteger(categoryId) ? categoryId : null,
      genreIds,
    });

    if (exact.length) {
      return res.json({ exactMatch: true, message: null, data: exact });
    }

    const relevant = await searchRelevant({
      q: q || null,
      categoryId: categoryId && Number.isInteger(categoryId) ? categoryId : null,
      genreIds,
    });

    return res.json({
      exactMatch: false,
      message: 'Nothing matched exactly, so here are close results.',
      data: relevant,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load movies.' });
  }
}

async function getMovie(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
              m.created_at, m.updated_at, c.name AS category_name
       FROM movies m
       JOIN categories c ON c.id = m.category_id
       WHERE m.id = ?`,
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    const [movie] = await attachGenres(rows);
    return res.json({ data: movie });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load movie.' });
  }
}

async function createMovie(req, res) {
  const connection = await pool.getConnection();
  try {
    const { title, description, category_id, release_date } = req.body;
    const genreIds = parseGenreIds(req.body.genre_ids);

    if (!genreIds.length) {
      if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
      return res.status(400).json({ message: 'Select at least one genre.' });
    }

    const [cat] = await connection.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (!cat.length) {
      if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
      return res.status(400).json({ message: 'Invalid category.' });
    }

    const [genres] = await connection.query(
      `SELECT id FROM genres WHERE id IN (${genreIds.map(() => '?').join(',')})`,
      genreIds
    );
    if (genres.length !== genreIds.length) {
      if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
      return res.status(400).json({ message: 'One or more genres are invalid.' });
    }

    const posterPath = req.file ? toPublicPosterPath(req.file.filename) : null;

    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO movies (title, description, category_id, release_date, poster_path)
       VALUES (?, ?, ?, ?, ?)`,
      [title.trim(), description.trim(), category_id, release_date, posterPath]
    );

    for (const gid of genreIds) {
      await connection.query(
        'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)',
        [result.insertId, gid]
      );
    }
    await connection.commit();

    const [rows] = await pool.query(
      `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
              m.created_at, m.updated_at, c.name AS category_name
       FROM movies m
       JOIN categories c ON c.id = m.category_id
       WHERE m.id = ?`,
      [result.insertId]
    );
    const [movie] = await attachGenres(rows);
    return res.status(201).json({ message: 'Movie created.', data: movie });
  } catch (err) {
    await connection.rollback();
    if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
    console.error(err);
    return res.status(500).json({ message: 'Failed to create movie.' });
  } finally {
    connection.release();
  }
}

async function updateMovie(req, res) {
  const connection = await pool.getConnection();
  try {
    const movieId = req.params.id;
    const [existingRows] = await connection.query('SELECT * FROM movies WHERE id = ?', [movieId]);
    if (!existingRows.length) {
      if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
      return res.status(404).json({ message: 'Movie not found.' });
    }
    const existing = existingRows[0];

    const title = req.body.title?.trim() || existing.title;
    const description = req.body.description?.trim() || existing.description;
    const category_id = req.body.category_id || existing.category_id;
    const release_date = req.body.release_date || existing.release_date;
    const genreIds = parseGenreIds(req.body.genre_ids);

    if (!genreIds.length) {
      if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
      return res.status(400).json({ message: 'Select at least one genre.' });
    }

    const [cat] = await connection.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (!cat.length) {
      if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
      return res.status(400).json({ message: 'Invalid category.' });
    }

    const [genres] = await connection.query(
      `SELECT id FROM genres WHERE id IN (${genreIds.map(() => '?').join(',')})`,
      genreIds
    );
    if (genres.length !== genreIds.length) {
      if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
      return res.status(400).json({ message: 'One or more genres are invalid.' });
    }

    let posterPath = existing.poster_path;
    if (req.file) {
      posterPath = toPublicPosterPath(req.file.filename);
    }

    await connection.beginTransaction();
    await connection.query(
      `UPDATE movies
       SET title = ?, description = ?, category_id = ?, release_date = ?, poster_path = ?
       WHERE id = ?`,
      [title, description, category_id, release_date, posterPath, movieId]
    );
    await connection.query('DELETE FROM movie_genres WHERE movie_id = ?', [movieId]);
    for (const gid of genreIds) {
      await connection.query(
        'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)',
        [movieId, gid]
      );
    }
    await connection.commit();

    if (req.file && existing.poster_path) {
      deletePosterFile(existing.poster_path);
    }

    const [rows] = await pool.query(
      `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
              m.created_at, m.updated_at, c.name AS category_name
       FROM movies m
       JOIN categories c ON c.id = m.category_id
       WHERE m.id = ?`,
      [movieId]
    );
    const [movie] = await attachGenres(rows);
    return res.json({ message: 'Movie updated.', data: movie });
  } catch (err) {
    await connection.rollback();
    if (req.file) deletePosterFile(toPublicPosterPath(req.file.filename));
    console.error(err);
    return res.status(500).json({ message: 'Failed to update movie.' });
  } finally {
    connection.release();
  }
}

async function deleteMovie(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
    deletePosterFile(rows[0].poster_path);
    return res.json({ message: 'Movie deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete movie.' });
  }
}

async function stats(_req, res) {
  try {
    const [[movies]] = await pool.query('SELECT COUNT(*) AS count FROM movies');
    const [[categories]] = await pool.query('SELECT COUNT(*) AS count FROM categories');
    const [[genres]] = await pool.query('SELECT COUNT(*) AS count FROM genres');
    return res.json({
      data: {
        movies: movies.count,
        categories: categories.count,
        genres: genres.count,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load stats.' });
  }
}

module.exports = {
  listMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  stats,
};

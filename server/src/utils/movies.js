const pool = require('../config/db');

async function getGenresForMovieIds(movieIds) {
  if (!movieIds.length) return {};
  const placeholders = movieIds.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT mg.movie_id, g.id, g.name
     FROM movie_genres mg
     JOIN genres g ON g.id = mg.genre_id
     WHERE mg.movie_id IN (${placeholders})
     ORDER BY g.name`,
    movieIds
  );
  return rows.reduce((acc, row) => {
    if (!acc[row.movie_id]) acc[row.movie_id] = [];
    acc[row.movie_id].push({ id: row.id, name: row.name });
    return acc;
  }, {});
}

function formatMovie(row) {
  const release =
    row.release_date instanceof Date
      ? row.release_date.toISOString().slice(0, 10)
      : String(row.release_date).slice(0, 10);
  return {
    ...row,
    release_date: release,
  };
}

async function attachGenres(movies) {
  const list = Array.isArray(movies) ? movies : [movies];
  const map = await getGenresForMovieIds(list.map((m) => m.id));
  return list.map((m) => ({
    ...formatMovie(m),
    genres: map[m.id] || [],
  }));
}

function parseGenreIds(raw) {
  if (raw == null || raw === '') return [];
  if (Array.isArray(raw)) {
    return [...new Set(raw.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return [...new Set(parsed.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
      }
      if (typeof parsed === 'number' && Number.isInteger(parsed) && parsed > 0) {
        return [parsed];
      }
    } catch {
      // fall through to comma-separated parsing
    }
    return [
      ...new Set(
        trimmed
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => Number.isInteger(n) && n > 0)
      ),
    ];
  }
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? [n] : [];
}

async function fetchMoviesByIds(ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
            m.created_at, m.updated_at, c.name AS category_name
     FROM movies m
     JOIN categories c ON c.id = m.category_id
     WHERE m.id IN (${placeholders})
     ORDER BY FIELD(m.id, ${placeholders})`,
    [...ids, ...ids]
  );
  return attachGenres(rows);
}

async function searchExact({ q, categoryId, genreIds }) {
  const where = [];
  const params = [];

  if (q) {
    where.push('m.title LIKE ?');
    params.push(`%${q}%`);
  }
  if (categoryId) {
    where.push('m.category_id = ?');
    params.push(categoryId);
  }

  let having = '';
  if (genreIds.length) {
    where.push(
      `m.id IN (
        SELECT movie_id FROM movie_genres
        WHERE genre_id IN (${genreIds.map(() => '?').join(',')})
        GROUP BY movie_id
        HAVING COUNT(DISTINCT genre_id) = ?
      )`
    );
    params.push(...genreIds, genreIds.length);
  }

  const sql = `
    SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
           m.created_at, m.updated_at, c.name AS category_name
    FROM movies m
    JOIN categories c ON c.id = m.category_id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY m.release_date DESC, m.title ASC
  `;

  const [rows] = await pool.query(sql, params);
  return attachGenres(rows);
}

async function searchRelevant({ q, categoryId, genreIds }) {
  if (q) {
    const [rows] = await pool.query(
      `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
              m.created_at, m.updated_at, c.name AS category_name
       FROM movies m
       JOIN categories c ON c.id = m.category_id
       WHERE m.title LIKE ?
       ORDER BY m.release_date DESC
       LIMIT 20`,
      [`%${q}%`]
    );
    if (rows.length) return attachGenres(rows);
  }

  if (categoryId) {
    const [rows] = await pool.query(
      `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
              m.created_at, m.updated_at, c.name AS category_name
       FROM movies m
       JOIN categories c ON c.id = m.category_id
       WHERE m.category_id = ?
       ORDER BY m.release_date DESC
       LIMIT 20`,
      [categoryId]
    );
    if (rows.length) return attachGenres(rows);
  }

  if (genreIds.length) {
    const [rows] = await pool.query(
      `SELECT DISTINCT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
              m.created_at, m.updated_at, c.name AS category_name
       FROM movies m
       JOIN categories c ON c.id = m.category_id
       JOIN movie_genres mg ON mg.movie_id = m.id
       WHERE mg.genre_id IN (${genreIds.map(() => '?').join(',')})
       ORDER BY m.release_date DESC
       LIMIT 20`,
      genreIds
    );
    if (rows.length) return attachGenres(rows);
  }

  const [rows] = await pool.query(
    `SELECT m.id, m.title, m.description, m.category_id, m.release_date, m.poster_path,
            m.created_at, m.updated_at, c.name AS category_name
     FROM movies m
     JOIN categories c ON c.id = m.category_id
     ORDER BY m.created_at DESC
     LIMIT 12`
  );
  return attachGenres(rows);
}

module.exports = {
  attachGenres,
  parseGenreIds,
  fetchMoviesByIds,
  searchExact,
  searchRelevant,
};

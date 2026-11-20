const express = require('express');
const { body } = require('express-validator');
const {
  listMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  stats,
} = require('../controllers/movieController');
const { authenticateAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { optionalPosterUpload } = require('../middleware/upload');

const router = express.Router();

router.get('/stats/summary', authenticateAdmin, stats);
router.get('/', listMovies);
router.get('/:id', getMovie);

router.post(
  '/',
  authenticateAdmin,
  optionalPosterUpload,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('category_id').notEmpty().withMessage('Category is required.'),
    body('release_date').isISO8601().withMessage('Valid release date is required.'),
  ],
  validate,
  createMovie
);

router.put(
  '/:id',
  authenticateAdmin,
  optionalPosterUpload,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty.'),
    body('release_date').optional().isISO8601().withMessage('Valid release date is required.'),
  ],
  validate,
  updateMovie
);

router.delete('/:id', authenticateAdmin, deleteMovie);

module.exports = router;

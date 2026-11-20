const express = require('express');
const { body } = require('express-validator');
const {
  listGenres,
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genreController');
const { authenticateAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/', listGenres);
router.get('/:id', getGenre);

router.post(
  '/',
  authenticateAdmin,
  [body('name').trim().notEmpty().withMessage('Genre name is required.')],
  validate,
  createGenre
);

router.put(
  '/:id',
  authenticateAdmin,
  [body('name').trim().notEmpty().withMessage('Genre name is required.')],
  validate,
  updateGenre
);

router.delete('/:id', authenticateAdmin, deleteGenre);

module.exports = router;

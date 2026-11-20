const express = require('express');
const { body } = require('express-validator');
const {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authenticateAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/', listCategories);
router.get('/:id', getCategory);

router.post(
  '/',
  authenticateAdmin,
  [body('name').trim().notEmpty().withMessage('Category name is required.')],
  validate,
  createCategory
);

router.put(
  '/:id',
  authenticateAdmin,
  [body('name').trim().notEmpty().withMessage('Category name is required.')],
  validate,
  updateCategory
);

router.delete('/:id', authenticateAdmin, deleteCategory);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const { login, me } = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

router.get('/me', authenticateAdmin, me);

module.exports = router;

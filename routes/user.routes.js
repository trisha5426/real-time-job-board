const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users (with filtering)
// @access  Private
router.get('/', getUsers);

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private
router.get('/:id', getUser);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put(
  '/:id',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('profile.phone')
      .optional()
      .trim(),
    body('profile.location')
      .optional()
      .trim(),
    body('profile.bio')
      .optional()
      .trim()
  ],
  validate,
  updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', deleteUser);

module.exports = router;


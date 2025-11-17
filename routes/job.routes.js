const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
} = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs (with filtering)
// @access  Public
router.get('/', getJobs);

// @route   GET /api/jobs/my-jobs
// @desc    Get jobs posted by current user
// @access  Private (Recruiter only)
router.get('/my-jobs', protect, authorize('recruiter'), getMyJobs);

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', getJob);

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private (Recruiter only)
router.post(
  '/',
  protect,
  authorize('recruiter'),
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Job title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Job description is required'),
    body('company')
      .trim()
      .notEmpty().withMessage('Company name is required'),
    body('location')
      .trim()
      .notEmpty().withMessage('Location is required'),
    body('type')
      .isIn(['full-time', 'part-time', 'contract', 'internship'])
      .withMessage('Job type must be one of: full-time, part-time, contract, internship'),
    body('status')
      .optional()
      .isIn(['active', 'closed', 'draft'])
      .withMessage('Status must be one of: active, closed, draft')
  ],
  validate,
  createJob
);

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (Recruiter only - owner)
router.put(
  '/:id',
  protect,
  authorize('recruiter'),
  [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('type')
      .optional()
      .isIn(['full-time', 'part-time', 'contract', 'internship'])
      .withMessage('Job type must be one of: full-time, part-time, contract, internship'),
    body('status')
      .optional()
      .isIn(['active', 'closed', 'draft'])
      .withMessage('Status must be one of: active, closed, draft')
  ],
  validate,
  updateJob
);

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private (Recruiter only - owner)
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;


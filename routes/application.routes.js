const express = require('express');
const { body } = require('express-validator');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/applications
// @desc    Get all applications (filtered by user role)
// @access  Private
router.get('/', getApplications);

// @route   GET /api/applications/:id
// @desc    Get single application by ID
// @access  Private
router.get('/:id', getApplication);

// @route   POST /api/applications
// @desc    Create new application
// @access  Private (Job seeker only)
router.post(
  '/',
  authorize('job_seeker'),
  [
    body('job')
      .notEmpty().withMessage('Job ID is required')
      .isMongoId().withMessage('Invalid job ID'),
    body('coverLetter')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Cover letter cannot exceed 2000 characters'),
    body('resume.url')
      .optional()
      .isURL().withMessage('Resume URL must be a valid URL')
  ],
  validate,
  createApplication
);

// @route   PUT /api/applications/:id
// @desc    Update application status
// @access  Private (Recruiter only - for their jobs)
router.put(
  '/:id',
  authorize('recruiter'),
  [
    body('status')
      .optional()
      .isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'])
      .withMessage('Invalid status'),
    body('notes')
      .optional()
      .trim()
  ],
  validate,
  updateApplication
);

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private (Job seeker only - their own applications)
router.delete('/:id', authorize('job_seeker'), deleteApplication);

module.exports = router;


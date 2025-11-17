const Application = require('../models/Application.model');
const Job = require('../models/Job.model');

// @desc    Get all applications (with filtering)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    let query = {};

    // Job seekers can only see their own applications
    if (req.user.role === 'job_seeker') {
      query.applicant = req.user.id;
    }

    // Recruiters can see applications for their jobs
    if (req.user.role === 'recruiter') {
      const myJobs = await Job.find({ postedBy: req.user.id });
      const jobIds = myJobs.map(job => job._id);
      query.job = { $in: jobIds };
    }

    const { status, job } = req.query;

    if (status) {
      query.status = status;
    }

    if (job) {
      query.job = job;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location type')
      .populate('applicant', 'name email profile')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: {
        applications
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email profile');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    if (req.user.role === 'job_seeker' && application.applicant._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    if (req.user.role === 'recruiter') {
      const job = await Job.findById(application.job._id);
      if (job.postedBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this application'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        application
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private (Job seeker only)
const createApplication = async (req, res, next) => {
  try {
    const { job, coverLetter, resume } = req.body;

    // Check if job exists
    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is active
    if (jobExists.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply to inactive job'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Create application
    const application = await Application.create({
      job,
      applicant: req.user.id,
      coverLetter,
      resume
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        application: populatedApplication
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Recruiter only - for their jobs)
const updateApplication = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter who posted the job
    const job = await Job.findById(application.job);
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application
    application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        reviewedAt: status !== 'pending' ? Date.now() : null
      },
      { new: true, runValidators: true }
    ).populate('job', 'title company')
     .populate('applicant', 'name email');

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: {
        application
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Job seeker only - their own applications)
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
};


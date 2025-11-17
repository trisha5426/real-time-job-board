const Job = require('../models/Job.model');

// @desc    Get all jobs (with filtering and pagination)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { 
      search, 
      type, 
      location, 
      status = 'active',
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    let query = { status };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email profile.company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: {
        jobs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email profile.company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        job
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
const createJob = async (req, res, next) => {
  try {
    // Add postedBy to request body
    req.body.postedBy = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: {
        job
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only - owner)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: {
        job
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only - owner)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the owner
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by current user
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter only)
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: {
        jobs
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};


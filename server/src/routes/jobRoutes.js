const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");


// ================================
// PUBLIC ROUTES
// ================================

// Get all jobs
router.get(
  "/",
  getAllJobs
);


// ================================
// EMPLOYER PROTECTED ROUTES
// ================================

// Create a new job
router.post(
  "/",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  createJob
);


// Update job
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  updateJob
);


// Delete job
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("EMPLOYER"),
  deleteJob
);


// ================================
// SINGLE JOB ROUTE
// IMPORTANT:
// Keep this route at the bottom
// ================================

router.get(
  "/:id",
  getJobById
);


module.exports = router;
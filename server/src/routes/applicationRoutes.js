const express = require("express");

const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

// Candidate applies for a job
router.post(
  "/jobs/:jobId",
  authenticateToken,
  applyForJob
);

// Candidate views own applications
router.get(
  "/my",
  authenticateToken,
  getMyApplications
);

// Employer views applications
router.get(
  "/employer",
  authenticateToken,
  getEmployerApplications
);

// Employer updates application status
router.patch(
  "/:applicationId/status",
  authenticateToken,
  updateApplicationStatus
);

module.exports = router;
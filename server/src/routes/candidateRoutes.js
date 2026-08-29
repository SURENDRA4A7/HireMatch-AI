const express = require("express");

const router = express.Router();

const {
  getMatchedCandidates,
  getCandidateDetails,
} = require("../controllers/candidateController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");


// Employer views matched candidates for a job
router.get(
  "/jobs/:jobId/candidates",
  authenticateToken,
  getMatchedCandidates
);


// Employer views one candidate
router.get(
  "/applications/:applicationId",
  authenticateToken,
  getCandidateDetails
);


module.exports = router;
const express = require("express");

const router = express.Router();

const {
  getJobMatch,
} = require("../controllers/matchController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

// Calculate match between logged-in candidate and job
router.get(
  "/jobs/:jobId",
  authenticateToken,
  getJobMatch
);

module.exports = router;
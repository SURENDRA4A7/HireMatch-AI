const express = require("express");

const router = express.Router();

const {
  getJobMatch,
} = require("../controllers/matchingController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.post(
  "/job/:jobId",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  getJobMatch
);

module.exports = router;
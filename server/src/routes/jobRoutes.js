const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRole("EMPLOYER"),
  createJob
);

router.get(
  "/",
  getAllJobs
);

router.get(
  "/:id",
  getJobById
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("EMPLOYER"),
  updateJob
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("EMPLOYER"),
  deleteJob
);

module.exports = router;
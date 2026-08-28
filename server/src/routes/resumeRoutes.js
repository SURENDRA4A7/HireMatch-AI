const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  uploadResume,
  getMyResume,
} = require("../controllers/resumeController");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension !== ".pdf") {
    return cb(
      new Error("Only PDF files are allowed")
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  authenticateToken,
  authorizeRole("CANDIDATE"),
  upload.single("resume"),
  uploadResume
);

router.get(
  "/my",
  authenticateToken,
  authorizeRole("CANDIDATE"),
  getMyResume
);

module.exports = router;
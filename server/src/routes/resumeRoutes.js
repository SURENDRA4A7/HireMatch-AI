const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  uploadResume,
  getMyResume,
} = require("../controllers/resumeController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =================================
// ENSURE UPLOAD DIRECTORY EXISTS
// =================================

const uploadDirectory = path.join(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =================================
// MULTER STORAGE
// =================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

// =================================
// FILE FILTER
// =================================

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (extension !== ".pdf") {
    return cb(
      new Error("Only PDF files are allowed")
    );
  }

  cb(null, true);
};

// =================================
// MULTER CONFIGURATION
// =================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =================================
// UPLOAD RESUME
// =================================

router.post(
  "/upload",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  upload.single("resume"),
  uploadResume
);

// =================================
// GET MY RESUME
// =================================

router.get(
  "/my",
  authenticateToken,
  authorizeRoles("CANDIDATE"),
  getMyResume
);

module.exports = router;
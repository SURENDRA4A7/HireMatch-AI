const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const resumeRoutes = require("./src/routes/resumeRoutes");
const matchRoutes = require("./src/routes/matchRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const candidateRoutes = require("./src/routes/candidateRoutes");
const matchingRoutes = require("./src/routes/matchingRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://hire-match-ai-wheat.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Root route - for Render backend check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "HireMatch AI Backend is running successfully",
    status: "OK",
  });
});

// API health check
app.get("/api/", (req, res) => {
  res.status(200).json({
    message: "HireMatch AI API is running",
  });
});

// Database connection test
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT 1 AS result"
    );

    return res.status(200).json({
      message: "MySQL connection successful",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      message: "MySQL connection failed",
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/resumes", resumeRoutes);

app.use("/api/matches", matchRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/candidates", candidateRoutes);

app.use("/api/matching", matchingRoutes);

app.use("/api/dashboard", dashboardRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
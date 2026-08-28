const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/", (req, res) => {
  res.status(200).json({
    message: "HireMatch AI API is running",
  });
});

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

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
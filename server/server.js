const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/", (req, res) => {
  res.json({
    message: "HireMatch AI API is running",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.json({
      message: "MySQL connection successful",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "MySQL connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
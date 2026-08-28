const express = require("express");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./src/routes/authRoutes");
const {
  authenticateToken,
} = require("./src/middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/", (req, res) => {
  res.json({
    message: "HireMatch AI API is running",
  });
});

app.get(
  "/api/auth/me",
  authenticateToken,
  (req, res) => {
    res.json({
      message: "Authenticated user",
      user: req.user,
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
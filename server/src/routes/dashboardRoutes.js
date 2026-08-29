const express = require("express");

const router = express.Router();


const {

  getCandidateDashboard,

  getEmployerDashboard,

} = require(
  "../controllers/dashboardController"
);


const {

  authenticateToken,

} = require(
  "../middleware/authMiddleware"
);


// =====================================
// CANDIDATE DASHBOARD
// =====================================

router.get(
  "/candidate",
  authenticateToken,
  getCandidateDashboard
);


// =====================================
// EMPLOYER DASHBOARD
// =====================================

router.get(
  "/employer",
  authenticateToken,
  getEmployerDashboard
);


module.exports = router;
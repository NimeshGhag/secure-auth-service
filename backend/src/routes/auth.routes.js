const express = require("express");

const {
  registerController,
  loginController,
  logoutController,
  verifyController,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", logoutController);

router.get("/verify-email", verifyController);

// Temporary implementation: returning basic response.
// This will be moved to a dedicated user route/controller
// where full user profile details will be handled.

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "This is the profile page",
  });
});

module.exports = router;

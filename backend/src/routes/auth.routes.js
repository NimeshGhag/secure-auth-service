const express = require("express");

const {
  registerController,
  loginController,
  logoutController,
  verifyController,
  resendVerifyController,
  forgotPasswordController,
  resetPasswordController,
  googleAuthController,
  refreshTokenController,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const {
  apiLimiter,
  authLimiter,
} = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/register", apiLimiter, registerController);

router.post("/login", authLimiter, loginController);

router.post("/logout", logoutController);

router.get("/verify-email", authLimiter, verifyController);

router.post("/resend-verification", authLimiter, resendVerifyController);

router.post("/forgot-password", authLimiter, forgotPasswordController);

router.post("/reset-password", authLimiter, resetPasswordController);

router.post("/google", authLimiter, googleAuthController);

router.post("/refresh-token", refreshTokenController);

// Temporary implementation: returning basic response.
// This will be moved to a dedicated user route/controller
// where full user profile details will be handled.

router.get("/profile", authMiddleware, apiLimiter, (req, res) => {
  return res.json({
    message: "This is the profile page",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = router;

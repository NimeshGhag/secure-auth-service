const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/email.service");
const { verifyGoogleToken } = require("../services/googleAuth.service");
const { sendTokenResponse } = require("../utils/authLogin.helper");
const cookieOptions = require("../utils/cookieOptions").cookieOptions;
const refreshTokenModel = require("../models/refreshToken.model");

const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const isUser = await userModel.findOne({ email });

    if (isUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const token = jwt.sign({ id: user._id }, process.env.EMAIL_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    try {
      await sendEmail(
        user.email,
        "Email Verification",
        `Please verify your email by clicking the following link: ${verificationLink}`,
        `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
      );
    } catch (error) {
      console.error("Error sending email:", error);

      return res.status(500).json({
        message: "User registered but failed to send verification email",
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const verifyController = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({
      message: "verification token is required",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Email already verified",
      });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};

const resendVerifyController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Email is already verified, You can login ",
      });
    }

    const timeStamp = user.lastVerificationEmailSentAt;
    if (timeStamp) {
      const currentTime = new Date();
      const timeDiff = (currentTime - timeStamp) / 1000;

      if (timeDiff < 60) {
        return res.status(429).json({
          message:
            "Please wait 60 seconds before requesting another verification email",
        });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.EMAIL_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
    try {
      await sendEmail(
        user.email,
        "Email Verification",
        `Please verify your email by clicking the following link: ${verificationLink}`,
        `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
      );

      user.lastVerificationEmailSentAt = new Date();
      await user.save();

      return res.status(200).json({
        message: "Verification email resent successfully",
      });
    } catch (error) {
      console.error("Error sending email:", error);

      return res.status(200).json({
        message: "Failed to send verification email",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });

  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
      });
    }

    sendTokenResponse(res, user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logoutController = async (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
  });
  res.clearCookie("refreshToken", {
    ...cookieOptions,
  });

  await refreshTokenModel.findOneAndDelete({ token: req.cookies.refreshToken });

  return res.status(200).json({
    message: "Logout successful",
  });
};

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "email is required" });

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      const forgotToken = jwt.sign(
        { id: user._id },
        process.env.FORGOT_TOKEN_SECRET,
        {
          expiresIn: "10m",
        },
      );

      const restLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${forgotToken}`;

      try {
        await sendEmail(
          user.email,
          "Reset password",
          `Please reset your password by clicking the following link: ${restLink}`,
          `<p>Please reset your password by clicking the following link: <a href="${restLink}">Reset Password</a></p>`,
        );
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(200).json({
          message:
            "If the email is registered, a password reset link has been sent",
        });
      }
    }

    return res.status(200).json({
      message:
        "If the email is registered, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Error in forgot password controller:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const resetPasswordController = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      message: "Token and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);

    if (!decoded.id) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const user = await userModel.findById(decoded.id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful. Please login again.",
    });
  } catch (error) {
    console.error("Error in reset password controller:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const googleAuthController = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      message: "Google ID token is required",
    });
  }

  try {
    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser) {
      return res.status(400).json({
        message: "Invalid Google user",
      });
    }
    const { email, name, providerId } = googleUser;

    const user = await userModel.findOne({ email });

    if (user) {
      if (!user.providerId) {
        user.providerId = providerId;
        user.isVerified = true;
        await user.save();
      }

      sendTokenResponse(res, user);
    } else {
      const newUser = await userModel.create({
        name,
        email,
        provider: "google",
        providerId,
        isVerified: true,
      });

      sendTokenResponse(res, newUser);
    }
  } catch (error) {
    console.error("Error in Google auth controller:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is required",
    });
  }

  try {
    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const refreshTokenInDb = await refreshTokenModel.findOne({
      token: refreshToken,
    });

    if (!refreshTokenInDb) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found ",
      });
    }

    sendTokenResponse(res, user, "Token refreshed successfully");
  } catch (error) {
    console.error("Error in refresh token controller:", error);
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  verifyController,
  resendVerifyController,
  forgotPasswordController,
  resetPasswordController,
  googleAuthController,
  refreshTokenController,
};

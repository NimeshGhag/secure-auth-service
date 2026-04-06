// utils/authHelper.js
const jwt = require("jsonwebtoken");

const sendTokenResponse = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 3600000,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

module.exports = { sendTokenResponse };
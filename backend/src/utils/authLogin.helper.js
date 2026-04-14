// utils/authHelper.js
const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../models/refreshToken.model");
const { cookieOptions } = require("./cookieOptions");

const sendTokenResponse = async (res, user, message = "Login successful") => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  await refreshTokenModel.findOneAndUpdate(
    { user: user._id },
    { token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 3600000) },
    { upsert: true, returnDocument: "after" },
  );

  // const newRefreshToken = await refreshTokenModel.create({
  //   user: user._id,
  //   token: refreshToken,
  //   expiresAt: new Date(Date.now() + 7 * 24 * 3600000),
  // });
  // const isProduction = process.env.NODE_ENV === "production";

  // const cookieOptions = {
  //   httpOnly: true,
  //   sameSite: isProduction ? "none" : "lax",
  //   secure: isProduction,
  // };

  res.cookie("token", token, {
    ...cookieOptions(),
    maxAge: 3600000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 3600000,
  });

  res.status(200).json({
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

module.exports = { sendTokenResponse, cookieOptions };

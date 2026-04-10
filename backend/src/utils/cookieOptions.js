const cookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };
  return cookieOptions;
};

module.exports = { cookieOptions };

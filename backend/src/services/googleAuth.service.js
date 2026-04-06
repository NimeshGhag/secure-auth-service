const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
      email: payload.email,
      name: payload.name,
      providerId: payload.sub,
    };
  } catch (error) {
    throw new Error("Invalid Google token");
  }
};

module.exports = {
  verifyGoogleToken,
};

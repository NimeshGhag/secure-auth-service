const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI_PROD || process.env.MONGODB_URI_DEV,
    );
    console.log("Connected To Db");
  } catch (error) {
    console.log("Error Connecting To Db", error);
  }
};

module.exports = connectToDB;

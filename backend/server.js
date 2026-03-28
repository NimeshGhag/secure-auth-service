require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/db");

const port = process.env.PORT;

const startServer = async () => {
  try {
    await connectToDB();
    app.listen(port, () => {
      console.log(`Server is Running on Port ${port}`);
    });
  } catch (error) {
    process.exit(1);
    console.error("Error starting server:", error);
  }
};

startServer();

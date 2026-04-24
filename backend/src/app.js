const express = require("express");
const cokieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://apis.google.com"
        ],

        connectSrc: [
          "'self'",
          "https://accounts.google.com"
        ],

        frameSrc: [
          "'self'",
          "https://accounts.google.com"
        ],

        imgSrc: [
          "'self'",
          "data:",
          "https://lh3.googleusercontent.com"
        ],
      },
    },
  })
);

app.use(express.json());
app.use(cokieParser());

app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "../public")));

app.get((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;

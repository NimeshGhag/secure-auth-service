const express = require("express");
const cokieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");

const app = express();

// cors
const allowedOrigins = [
  "http://localhost:5173",
  "https://secure-auth-service-hfhg.onrender.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// helmet
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://*.google.com",
        ],

        connectSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://secure-auth-service-hfhg.onrender.com",
        ],

        frameSrc: ["'self'", "https://accounts.google.com"],

        imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],

        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

app.use(express.json());
app.use(cokieParser());

app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "../public")));

app.get((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;

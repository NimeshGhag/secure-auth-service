const express = require("express");
const cokieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes")

const app = express();

app.use(express.json());
app.use(cokieParser());


app.use("/api/auth", authRoutes);

module.exports = app;

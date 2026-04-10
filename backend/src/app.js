const express = require("express");
const cokieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes")

const app = express();

app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cokieParser());


app.use("/api/auth", authRoutes);

module.exports = app;

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("../API/routes/index");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(cors));
app.use(express.json());
app.use(cookieParser);

app.use(routes);
app.use(errorMiddleware);

module.exports = app;

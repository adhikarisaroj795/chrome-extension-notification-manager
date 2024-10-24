const express = require("express");
const locationRoute = require("./location.route");
const app = express();

app.use("/api/v1/whatsnew", locationRoute);

module.exports = app;

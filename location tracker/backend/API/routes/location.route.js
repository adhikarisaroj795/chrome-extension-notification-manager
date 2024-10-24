const express = require("express");
const loc_trck = require("../contollers/location.controller");

const router = express.Router();

router.route("/").post(loc_trck.locationTracker);

module.exports = router;

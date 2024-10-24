const mongooose = require("mongoose");

const locationSchema = new mongooose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
  Timestamp: {
    type: Date,
    default: Date.now,
  },
});

const locationModel = mongooose.model("Location", locationSchema);

module.exports = locationModel;

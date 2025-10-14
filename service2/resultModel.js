const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);

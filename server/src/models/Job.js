const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  company: { type: String },
  url: { type: String },
  category: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);

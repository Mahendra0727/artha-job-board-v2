const mongoose = require("mongoose");

const ImportLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  category: { type: String, default: "General" }, // Naya field
  total: { type: Number, default: 0 },
  new: { type: Number, default: 0 },
  updated: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Processing", "Completed", "Failed"],
    default: "Processing",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ImportLog", ImportLogSchema);

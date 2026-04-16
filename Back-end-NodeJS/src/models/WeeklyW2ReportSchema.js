const mongoose = require("mongoose");

const WeeklyW2ReportSchema = new mongoose.Schema(
  {
    total_docs: Number,
    fail_docs: Number,
    fail_rate: Number,
    status: Number, // 0,1,2
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeeklyW2Report", WeeklyW2ReportSchema);
let mongoose = require("mongoose");

let HistorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    employerName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    semester: {
      type: Array,
      default: [],
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.History ||
  mongoose.model("History", HistorySchema);

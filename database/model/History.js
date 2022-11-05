let mongoose = require("mongoose");

let HistorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Historu ||
  mongoose.model("History", HistorySchema);

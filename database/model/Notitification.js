let mongoose = require("mongoose");

let NotifiationSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["annoucement", "notification"],
    },
    // * for announcement
    seenBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Admins",
      },
    ],
    hide: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Admins",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotifiationSchema);

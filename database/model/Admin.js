let mongoose = require("mongoose");

let AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    role: {
      type: String,
      default: "admin",
    },
    // if barangay-admin
    barangay: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

let mongoose = require("mongoose");

let UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

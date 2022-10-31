let mongoose = require("mongoose");

let emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

let pensionSchema = new mongoose.Schema(
  {
    withPension: {
      type: Boolean,
      required: true,
    },
    monthlyPension: {
      type: Number,
    },
  },
  { _id: false }
);

let SeniorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
    },
    lastname: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    barangay: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactInformation: {
      type: String,
      required: true,
    },
    pensionStatus: pensionSchema,
    status: {
      type: String,
      required: true,
    },
    emergencyContact: emergencyContactSchema,
  },
  { timestamps: true }
);

export default mongoose.models.Senior || mongoose.model("Senior", SeniorSchema);

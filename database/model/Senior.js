let mongoose = require("mongoose");

let nameSchema = new mongoose.Schema(
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
    extensionName: {
      type: String,
    },
  },
  { _id: false }
);

let guardianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    middlename: {
      type: String,
    },
    lastname: {
      type: String,
    },
    relationship: {
      type: String,
    },
  },
  { _id: false }
);

let SeniorSchema = new mongoose.Schema(
  // IDENTIFICATION
  {
    name: nameSchema,
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
      required: true,
    },
    barangay: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    authorizedRepresentative: {
      type: Array,
      default: [],

      // {
      //   name: "",
      //   number: "",
      //   realtionship: ""
      // }
    },
    withSSS: {
      type: Boolean,
    },
    withPension: {
      type: Object,
    },
    guardian: guardianSchema,
    //  SOCIOECONOMIC INFO
    receivedPension: {
      type: Boolean, // don't know = null
    },
    receivedPension6mos: {
      type: Array,
    },
    sourceOfIncome: {
      type: Object,
      default: {
        salary: {
          status: false,
          value: 0,
        }, // if not false, then true then render the value
        entrep: {
          status: false,
          value: 0,
        },
        householdMember: {
          status: false,
          value: 0,
        },
        domesticMember: {
          status: false,
          value: 0,
        },
        internationalMember: {
          status: false,
          value: 0,
        },
        fromFriends: {
          status: false,
          value: 0,
        },
        fromGovernment: {
          status: false,
          value: 0,
        },
        others: {
          status: false,
          value: 0,
        },
      },
    },
    livingWith: {
      type: String,
      // 0 - alone
      // 1 - spouse
      // 2 - legal_child
      // 3 - other_relative
      // 4 - other_unrelated
    },
    frailQuestion: {
      type: Object,
      default: {
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        q5: null,
        q6: null,
      },
    },
    isPwd: {
      type: Object,
      // {
      //   status: Boolean,
      //   name: String
      // }
    },
    hasIllness: {
      type: Object,
      // {
      //   status: Boolean,
      //   name: String
      // }
    },
    mealsPerDay: {
      type: Number,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DECEASED", "ACTIVE_WITH_ILLNESS"],
      default: "ACTIVE",
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Senior || mongoose.model("Senior", SeniorSchema);

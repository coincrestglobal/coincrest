const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema(
  {
    policy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrivacyPolicy", privacySchema);

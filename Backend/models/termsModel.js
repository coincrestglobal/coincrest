const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
  {
    condition: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Terms", termsSchema);

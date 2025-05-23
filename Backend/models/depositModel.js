const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    txId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    fromAddress: { type: String, required: true },
    toAddress: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    tokenType: { type: String, enum: ["TRC-20", "BEP-20"] },
    isConfirmed: { type: Boolean, default: false },
    depositedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    bonusGiven: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);

module.exports = Deposit;

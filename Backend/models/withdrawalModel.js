const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    txId: { type: String },
    fromAddress: { type: String },
    toAddress: { type: String, required: true },
    tokenType: { type: String, enum: ["BEP-20"], required: true },
    timestamp: { type: Date },
    status: {
      type: String,
      enum: ["pending", , "completed"],
      default: "pending",
    },
    approvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isApproved: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);

module.exports = Withdrawal;

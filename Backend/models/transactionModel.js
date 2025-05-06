const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    txId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    fromAddress: { type: String, required: true },
    toAddress: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    tokenType: { type: String, enum: ["TRC-20", "BEP-20"] },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

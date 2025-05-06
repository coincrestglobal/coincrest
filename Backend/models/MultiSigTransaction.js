const mongoose = require("mongoose");

const MultiSigTransactionSchema = new mongoose.Schema({
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  signers: { type: [String], required: true }, // List of addresses of signers
  status: { type: String, default: "pending" },
  transactionHash: String,
});

module.exports = mongoose.model(
  "MultiSigTransaction",
  MultiSigTransactionSchema
);

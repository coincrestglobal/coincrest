const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    maxAmount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const InvestmentPlan = mongoose.model("InvestmentPlan", investmentPlanSchema);

module.exports = InvestmentPlan;

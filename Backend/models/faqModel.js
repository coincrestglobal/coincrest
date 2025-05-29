const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["general", "deposit", "payout"],
      required: [true, "Type is required"],
    },
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);
module.exports = Faq;

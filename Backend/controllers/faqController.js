const Faq = require("../models/faqModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createFaq = catchAsync(async (req, res, next) => {
  const { question, answer, type } = req.body;

  const faq = new Faq({ question, answer, type });

  await faq.save();

  res.status(201).json({
    status: "success",
    message: "FAQ created successfully.",
  });
});

exports.getFaqs = catchAsync(async (req, res, next) => {
  let { type } = req.query;

  const filter = {};
  if (type) {
    if (!["general", "deposit", "payout"].includes(type)) {
      return next(new AppError("Invalid FAQ type", 400));
    }
    filter.type = type;
  }

  const faqs = await Faq.find(filter)
    .sort({ updatedAt: -1 })
    .select("question answer type");

  res.status(200).json({
    status: "success",
    results: faqs.length,
    data: {
      faqs,
    },
  });
});

exports.deleteFaq = catchAsync(async (req, res, next) => {
  const { faqId } = req.params;

  const deleted = await Faq.findByIdAndDelete(faqId);

  if (!deleted) {
    return next(new AppError("FAQ not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "FAQ deleted successfully",
  });
});

const Terms = require("../models/termsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createTerms = catchAsync(async (req, res, next) => {
  const { title, condition } = req.body;

  const terms = new Terms({ title, condition });
  await terms.save();

  res.status(201).json({
    status: "success",
    message: "Term & Condition created successfully.",
  });
});

exports.getTerms = catchAsync(async (req, res) => {
  const terms = await Terms.find().sort({ updatedAt: -1 });

  res.status(200).json({
    status: "success",
    results: terms.length,
    data: {
      terms,
    },
  });
});

exports.deleteTerms = catchAsync(async (req, res, next) => {
  const { termId } = req.params;

  const deleted = await Terms.findByIdAndDelete(termId);

  if (!deleted) {
    return next(new AppError("Term & Condition not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Term & Condition deleted successfully.",
  });
});

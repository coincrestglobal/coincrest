const Privacy = require("../models/privacyPolicyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createPrivacy = catchAsync(async (req, res, next) => {
  const { title, policy } = req.body;

  const doc = new Privacy({ title, policy });
  await doc.save();

  res.status(201).json({
    status: "success",
    message: "Privacy policy created successfully.",
  });
});

exports.getPrivacy = catchAsync(async (req, res) => {
  const policies = await Privacy.find()
    .sort({ updatedAt: -1 })
    .select("title policy");

  res.status(200).json({
    status: "success",
    results: policies.length,
    data: {
      policies,
    },
  });
});

exports.deletePrivacy = catchAsync(async (req, res, next) => {
  const { policyId } = req.params;

  const deleted = await Privacy.findByIdAndDelete(policyId);

  if (!deleted) {
    return next(new AppError("Privacy policy not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Privacy policy deleted successfully.",
  });
});

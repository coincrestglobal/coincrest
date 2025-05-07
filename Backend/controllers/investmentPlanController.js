const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const InvestmentPlan = require("../models/investmentPlanmodel");

exports.getPlans = catchAsync(async (req, res) => {
  const plans = await InvestmentPlan.find().select(
    "_id name minAmount maxAmount interestRate"
  );

  return res.status(200).json({
    status: "success",
    results: plans.length,
    data: {
      plans,
    },
  });
});

exports.createInvestmentPlan = catchAsync(async (req, res, next) => {
  const { name, minAmount, maxAmount, interestRate } = req.body;

  const existingPlan = await InvestmentPlan.findOne({ name });
  if (existingPlan) {
    return next(
      new AppError("An investment plan with this name already exists.", 400)
    );
  }

  const newPlan = new InvestmentPlan({
    name,
    minAmount,
    // maxAmount,
    interestRate,
  });

  await newPlan.save();

  res.status(201).json({
    message: "Investment plan created successfully",
  });
});

exports.updateInvestmentPlan = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { name, minAmount, maxAmount, interestRate } = req.body;

  const updatedPlan = await InvestmentPlan.findByIdAndUpdate(
    userId,
    { name, minAmount, maxAmount, interestRate },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPlan) {
    return next(new AppError("No investment plan found with that ID", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "Investment plan updated successfully.",
    data: {
      plan: updatedPlan,
    },
  });
});

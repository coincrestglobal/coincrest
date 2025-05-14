const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const InvestmentPlan = require("../models/investmentPlanmodel");

exports.getPlans = catchAsync(async (req, res) => {
  const plans = await InvestmentPlan.find()
    .sort({ level: 1 })
    .select("_id level name minAmount maxAmount interestRate");

  return res.status(200).json({
    status: "success",
    results: plans.length,
    data: {
      plans,
    },
  });
});

exports.createInvestmentPlan = catchAsync(async (req, res, next) => {
  const { level, name, minAmount, maxAmount, interestRate } = req.body;

  const existingPlan = await InvestmentPlan.findOne({
    $or: [{ level }, { name }],
  });

  if (existingPlan) {
    return next(
      new AppError(
        `An investment plan with the name '${existingPlan.name}' or level '${existingPlan.level}' already exists.`,
        400
      )
    );
  }

  const overlappingPlan = await InvestmentPlan.findOne({
    $or: [{ minAmount: { $lte: maxAmount }, maxAmount: { $gte: minAmount } }],
  });

  if (overlappingPlan) {
    return next(
      new AppError("The amount range overlaps with an existing plan.", 400)
    );
  }

  const newPlan = new InvestmentPlan({
    name,
    level,
    minAmount,
    maxAmount,
    interestRate,
  });

  await newPlan.save();

  res.status(201).json({
    message: "Investment plan created successfully",
  });
});

exports.updateInvestmentPlan = catchAsync(async (req, res, next) => {
  const { planId } = req.params;
  const { name, minAmount, maxAmount, interestRate } = req.body;

  const updateData = { name, minAmount, maxAmount, interestRate };

  const overlappingPlan = await InvestmentPlan.findOne({
    $and: [
      { _id: { $ne: planId } },
      {
        $or: [
          { minAmount: { $lte: maxAmount }, maxAmount: { $gte: minAmount } },
        ],
      },
    ],
  });

  if (overlappingPlan) {
    return next(
      new AppError("The amount range overlaps with an existing plan.", 400)
    );
  }

  const updatedPlan = await InvestmentPlan.findByIdAndUpdate(
    planId,
    updateData,
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
  });
});

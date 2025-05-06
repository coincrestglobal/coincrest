const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Withdrawal = require("../models/withdrawalModel");

exports.getWithdrawals = catchAsync(async (req, res, next) => {
  const { status, tokenType, startDate, endDate } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (tokenType) {
    filter.tokenType = tokenType;
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const [withdrawals, total] = await Promise.all([
    Withdrawal.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .select("amount tokenType status toAddress createdAt")
      .populate("initiatedBy", "name email -_id")
      .populate("approvedBy", "name -_id"),
    Withdrawal.countDocuments(filter),
  ]);

  if (!withdrawals.length) {
    return next(new AppError("No pending withdrawals found.", 404));
  }

  res.status(200).json({
    status: "success",
    results: withdrawals.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      withdrawals,
    },
  });
});

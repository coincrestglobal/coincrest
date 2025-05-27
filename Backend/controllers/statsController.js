const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Deposit = require("../models/depositModel");
const Withdrawal = require("../models/withdrawalModel");

exports.getStats = catchAsync(async (req, res, next) => {
  const { range = "lifetime" } = req.query;

  const now = new Date();
  let fromDate;

  switch (range) {
    case "1d":
      fromDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      break;
    case "1w":
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "1m":
      fromDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "1y":
      fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    case "lifetime":
      fromDate = null;
      break;
    default:
      return next(new AppError("Invalid range value", 400));
  }

  const userQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};
  const depositQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};
  const withdrawalQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};

  const [totalUsers, totalDeposits, totalWithdrawals] = await Promise.all([
    User.countDocuments(userQuery),
    Deposit.countDocuments(depositQuery),
    Withdrawal.countDocuments(withdrawalQuery),
  ]);

  const [depositAmountAgg, withdrawalAmountAgg] = await Promise.all([
    Deposit.aggregate([
      ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Withdrawal.aggregate([
      ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const depositAmount = depositAmountAgg[0]?.total || 0;
  const withdrawalAmount = withdrawalAmountAgg[0]?.total || 0;

  res.status(200).json({
    totalUsers,
    totalDeposits,
    totalWithdrawals,
    depositAmount,
    withdrawalAmount,
  });
});

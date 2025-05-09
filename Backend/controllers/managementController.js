const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Withdrawal = require("../models/withdrawalModel");
const Deposit = require("../models/depositModel");

exports.getUsers = catchAsync(async (req, res, next) => {
  const { search, role, startDate, endDate } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
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

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name email updatedAt role"),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: users.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      users,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select("name email updatedAt role")
    .populate("deposits", "amount tokenType verifiedAt -_id")
    .populate("withdrawals", "amount tokenType status createdAt -_id");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Response me user aur totals ko return karenge
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

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
    return next(new AppError("No withdrawals found.", 404));
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

exports.getDeposits = catchAsync(async (req, res, next) => {
  const { tokenType, startDate, endDate } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

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

  const [deposits, total] = await Promise.all([
    Deposit.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .select("amount tokenType status fromAddress createdAt -_id")
      .populate("depositedBy", "name email -_id"),
    Deposit.countDocuments(filter),
  ]);

  if (!deposits.length) {
    return next(new AppError("No deposits found.", 404));
  }

  res.status(200).json({
    status: "success",
    results: deposits.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      deposits,
    },
  });
});

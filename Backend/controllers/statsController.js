const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Deposit = require("../models/depositModel");
const Withdrawal = require("../models/withdrawalModel");
const Review = require("../models/reviewModel");
const Feedback = require("../models/feedbackModel");

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper to format label based on range
function formatLabel(key, range) {
  if (range === "1d") {
    // key is hour number like 0,2,4,... convert to "00:00"
    return key.toString().padStart(2, "0") + ":00";
  }
  if (range === "1w") {
    // key is day index 0-6 (Sun-Sat)
    return dayNames[key];
  }
  if (range === "1m") {
    // key is week number 1-5
    return `Week ${key}`;
  }
  if (range === "1y") {
    // key is month number 0-11
    return monthNames[key];
  }
  if (range === "lifetime") {
    // key is year number as string or number
    return key.toString();
  }
  return key.toString();
}

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
      fromDate = new Date(now);
      fromDate.setMonth(now.getMonth() - 1);
      break;
    case "1y":
      fromDate = new Date(now);
      fromDate.setFullYear(now.getFullYear() - 1);
      break;
    case "lifetime":
      fromDate = null;
      break;
    default:
      return next(new AppError("Invalid range value", 400));
  }

  const userBaseFilter = { role: "user", isDeleted: false };
  const userQuery = fromDate
    ? { ...userBaseFilter, createdAt: { $gte: fromDate } }
    : userBaseFilter;

  const depositQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};
  const withdrawalQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};

  const [
    totalUsers,
    incTotalUsers,
    totalWithdrawals,
    incTotalWithdrawals,
    totalDepositAgg,
    incDepositAgg,
    totalWithdrawalAgg,
    incWithdrawalAgg,
  ] = await Promise.all([
    User.countDocuments(userBaseFilter),
    User.countDocuments(userQuery),
    Withdrawal.countDocuments(),
    Withdrawal.countDocuments(withdrawalQuery),
    Deposit.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Deposit.aggregate([
      ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Withdrawal.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Withdrawal.aggregate([
      ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalDepositAmount = totalDepositAgg[0]?.total || 0;
  const incDepositAmount = incDepositAgg[0]?.total || 0;
  const totalWithdrawalAmount = totalWithdrawalAgg[0]?.total || 0;
  const incWithdrawalAmount = incWithdrawalAgg[0]?.total || 0;

  // ----------------- Prepare labels and charts -----------------
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatLabel = (val, range) => {
    if (range === "1d") return `${val * 2}:00`;
    if (range === "1w") return dayNames[val];
    if (range === "1m") return `Week ${val}`;
    if (range === "1y") return monthNames[val - 1];
    if (range === "lifetime") return val.toString();
    return val;
  };

  let expectedLabels = [];

  if (range === "1d") {
    for (let h = 0; h < 24; h += 2) {
      expectedLabels.push(formatLabel(h / 2, "1d"));
    }
  } else if (range === "1w") {
    expectedLabels = dayNames;
  } else if (range === "1m") {
    expectedLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  } else if (range === "1y") {
    expectedLabels = monthNames;
  } else if (range === "lifetime") {
    const earliestUser = await User.findOne(userBaseFilter)
      .sort({ createdAt: 1 })
      .select("createdAt");
    const startYear = earliestUser
      ? earliestUser.createdAt.getFullYear()
      : now.getFullYear();
    const endYear = now.getFullYear();
    for (let y = startYear; y <= endYear; y++) {
      expectedLabels.push(y.toString());
    }
  }

  let groupId = null;
  switch (range) {
    case "1d":
      groupId = {
        $floor: { $divide: [{ $hour: "$createdAt" }, 2] },
      };
      break;
    case "1w":
      groupId = { $subtract: [{ $dayOfWeek: "$createdAt" }, 1] };
      break;
    case "1m":
      groupId = {
        $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] },
      };
      break;
    case "1y":
      groupId = { $month: "$createdAt" };
      break;
    case "lifetime":
      groupId = { $year: "$createdAt" };
      break;
  }

  const [usersAgg, depositsAgg, withdrawalsAgg] = await Promise.all([
    User.aggregate([
      ...(fromDate
        ? [{ $match: { ...userBaseFilter, createdAt: { $gte: fromDate } } }]
        : []),
      { $group: { _id: groupId, value: { $sum: 1 } } },
    ]),
    Deposit.aggregate([
      ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
      { $group: { _id: groupId, deposit: { $sum: "$amount" } } },
    ]),
    Withdrawal.aggregate([
      ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
      { $group: { _id: groupId, withdraw: { $sum: "$amount" } } },
    ]),
  ]);

  const userMap = new Map();
  usersAgg.forEach((u) => {
    userMap.set(formatLabel(u._id, range), u.value);
  });

  const depositMap = new Map();
  depositsAgg.forEach((d) => {
    depositMap.set(formatLabel(d._id, range), d.deposit);
  });

  const withdrawMap = new Map();
  withdrawalsAgg.forEach((w) => {
    withdrawMap.set(formatLabel(w._id, range), w.withdraw);
  });

  const usersChartData = expectedLabels.map((label) => ({
    name: label,
    value: userMap.get(label) || 0,
  }));

  const depositWithdrawChartData = expectedLabels.map((label) => ({
    name: label,
    deposit: depositMap.get(label) || 0,
    withdraw: withdrawMap.get(label) || 0,
  }));

  // ------------------------ Final Response ------------------------
  res.status(200).json({
    totalUsers,
    totalDeposit: totalDepositAmount,
    totalProfit: totalDepositAmount,
    payouts: totalWithdrawalAmount,
    incTotalUsers,
    incTotalDeposit: incDepositAmount,
    incTotalProfit: incDepositAmount,
    incPayouts: incWithdrawalAmount,
    usersChartData,
    depositWithdrawChartData,
  });
});

exports.getTotalCounts = catchAsync(async (req, res, next) => {
  const [
    totalDeposits,
    totalWithdrawals,
    totalUsers,
    totalReviews,
    totalFeedbacks,
  ] = await Promise.all([
    Deposit.countDocuments(),
    Withdrawal.countDocuments(),
    User.countDocuments(),
    Review.countDocuments(),
    Feedback.countDocuments(),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totalDeposits,
      totalWithdrawals,
      totalUsers,
      totalReviews,
      totalFeedbacks,
    },
  });
});

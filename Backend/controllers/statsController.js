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

  const userQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};
  const depositQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};
  const withdrawalQuery = fromDate ? { createdAt: { $gte: fromDate } } : {};

  // Basic totals
  const [totalUsers, totalDeposits, totalWithdrawals] = await Promise.all([
    User.countDocuments(userQuery),
    Deposit.countDocuments(depositQuery),
    Withdrawal.countDocuments(withdrawalQuery),
  ]);

  // Total amounts for deposits and withdrawals
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

  // ----------------- Prepare labels and aggregations for charts -----------------

  // Define expected labels per range
  let expectedLabels = [];

  if (range === "1d") {
    for (let h = 0; h < 24; h += 2) {
      expectedLabels.push(formatLabel(h, "1d"));
    }
  } else if (range === "1w") {
    expectedLabels = dayNames;
  } else if (range === "1m") {
    expectedLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  } else if (range === "1y") {
    expectedLabels = monthNames;
  } else if (range === "lifetime") {
    // Get earliest year from users collection for full lifetime range
    const earliestUser = await User.findOne()
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

  // ----------------- Aggregate users count grouped by the time bucket -----------------
  // Build group id and projection based on range
  let groupIdUser = null;
  switch (range) {
    case "1d":
      // group by 2-hour slot
      groupIdUser = {
        $floor: { $divide: [{ $hour: "$createdAt" }, 2] },
      };
      break;
    case "1w":
      // group by day of week (0=Sun..6=Sat)
      groupIdUser = { $dayOfWeek: "$createdAt" }; // Sunday=1..Saturday=7
      break;
    case "1m":
      // group by week of month (1-5)
      groupIdUser = {
        $ceil: {
          $divide: [{ $dayOfMonth: "$createdAt" }, 7],
        },
      };
      break;
    case "1y":
      // group by month number 0-11
      groupIdUser = { $month: "$createdAt" };
      break;
    case "lifetime":
      // group by year
      groupIdUser = { $year: "$createdAt" };
      break;
    default:
      groupIdUser = null;
  }

  // Mongo $dayOfWeek returns 1 for Sunday, but our dayNames index is 0-based Sunday
  // So we need to subtract 1 from $dayOfWeek to get 0-6 index
  // but aggregation does not support subtract in _id directly, so we'll adjust after aggregation

  let userGroupId = groupIdUser;
  if (range === "1w") {
    // Special handling for dayOfWeek - convert 1-7 to 0-6
    userGroupId = {
      $subtract: [{ $dayOfWeek: "$createdAt" }, 1],
    };
  }

  // Aggregate users by time bucket
  const usersAgg = await User.aggregate([
    ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
    {
      $group: {
        _id: userGroupId,
        value: { $sum: 1 },
      },
    },
  ]);

  // ----------------- Aggregate deposits and withdrawals by time bucket -----------------

  // Deposit groupId same as users groupId (based on range)
  let depositGroupId = userGroupId;
  if (range === "1w") {
    depositGroupId = {
      $subtract: [{ $dayOfWeek: "$createdAt" }, 1],
    };
  }

  const depositsAgg = await Deposit.aggregate([
    ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
    {
      $group: {
        _id: depositGroupId,
        deposit: { $sum: "$amount" },
      },
    },
  ]);

  // Withdrawals aggregated by time bucket and nested by day/week/etc. per deposit
  // We'll flatten for now: group withdrawals similarly
  let withdrawalGroupId = userGroupId;
  if (range === "1w") {
    withdrawalGroupId = {
      $subtract: [{ $dayOfWeek: "$createdAt" }, 1],
    };
  }

  const withdrawalsAgg = await Withdrawal.aggregate([
    ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
    {
      $group: {
        _id: withdrawalGroupId,
        withdraw: { $sum: "$amount" },
      },
    },
  ]);

  // ------------------- Create maps for quick lookup -----------------
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

  // ------------------- Merge expected labels with actual data -------------------
  const usersChartData = expectedLabels.map((label) => ({
    name: label,
    value: userMap.get(label) || 0,
  }));

  const depositWithdrawChartData = expectedLabels.map((label) => ({
    name: label,
    deposit: depositMap.get(label) || 0,
    withdraw: withdrawMap.get(label) || 0,
  }));

  // ------------------- Build response -------------------
  res.status(200).json({
    totalUsers,
    totalDeposit: totalDeposits,
    totalProfit: depositAmount,
    payouts: totalWithdrawals,
    incTotalUsers: totalUsers,
    incTotalDeposit: depositAmount,
    incTotalProfit: depositAmount,
    incPayouts: withdrawalAmount,
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

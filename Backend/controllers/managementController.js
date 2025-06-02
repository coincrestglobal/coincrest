const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Withdrawal = require("../models/withdrawalModel");
const Deposit = require("../models/depositModel");
const Notification = require("../models/notificationModel");
const generateToken = require("../utils/generateToken");
const config = require("../config/config");
const sendEmail = require("../utils/email");
const { transferTRC20 } = require("../services/trc20TransferService");
const { transferBEP20 } = require("../services/bep20TransferService");
const generateReferralCode = require("../utils/referralCodeGenerator");
const { default: mongoose } = require("mongoose");
const { default: Decimal } = require("decimal.js");

exports.getUsers = catchAsync(async (req, res, next) => {
  const { search, role, sort, startDate, endDate } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const baseFilter = { isDeleted: false };
  const filterConditions = [baseFilter];

  if (role) {
    filterConditions.push({ role });
  }

  if (search) {
    filterConditions.push({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
  }

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    filterConditions.push({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
  }

  const finalFilter =
    filterConditions.length > 1 ? { $and: filterConditions } : baseFilter;

  const sortOrder = { createdAt: sort === "desc" ? -1 : 1 };

  const [users, total] = await Promise.all([
    User.find(finalFilter)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .select("name email updatedAt role priority"),
    User.countDocuments(finalFilter),
  ]);

  res.status(200).json({
    status: "success",
    results: users.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: { users },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const user = await User.findById(id)
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
  const {
    status,
    tokenType,
    startDate,
    endDate,
    sort = "desc",
    search,
  } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filterConditions = [];

  // Basic filters
  if (status) {
    filterConditions.push({ status });
  }

  if (tokenType) {
    filterConditions.push({ tokenType });
  }

  // Search: txId, toAddress, amount, _id
  if (search) {
    search = search.trim();
    const searchRegex = { $regex: search, $options: "i" };
    const orSearch = [{ txId: searchRegex }, { toAddress: searchRegex }];

    // Include amount if numeric
    if (!isNaN(Number(search))) {
      orSearch.push({ amount: Number(search) });
    }

    // Include _id if valid ObjectId
    if (mongoose.Types.ObjectId.isValid(search)) {
      orSearch.push({ _id: new mongoose.Types.ObjectId(search) });
    }

    filterConditions.push({ $or: orSearch });
  }

  // Date range filter
  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    filterConditions.push({
      createdAt: { $gte: start, $lte: end },
    });
  }

  const finalFilter =
    filterConditions.length > 0 ? { $and: filterConditions } : {};

  const sortOrder = sort === "desc" ? -1 : 1;

  const [withdrawals, total] = await Promise.all([
    Withdrawal.find(finalFilter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("amount tokenType status toAddress txId createdAt")
      .populate("initiatedBy", "name email -_id")
      .populate("approvedBy", "name _id"),
    Withdrawal.countDocuments(finalFilter),
  ]);

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
  const { tokenType, startDate, endDate, sort = "desc", search } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filterConditions = [];

  if (tokenType) {
    filterConditions.push({ tokenType });
  }

  // Search by fromAddress, txId or amount
  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    const orSearch = [
      { fromAddress: searchRegex },
      { txId: searchRegex }, // <-- added txId search
    ];

    if (!isNaN(Number(search))) {
      orSearch.push({ amount: Number(search) });
    }

    filterConditions.push({ $or: orSearch });
  }

  // Date range filter
  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    filterConditions.push({
      createdAt: { $gte: start, $lte: end },
    });
  }

  const finalFilter =
    filterConditions.length > 0 ? { $and: filterConditions } : {};
  const sortOrder = sort === "desc" ? -1 : 1;

  const [deposits, total] = await Promise.all([
    Deposit.find(finalFilter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("amount tokenType status fromAddress txId createdAt -_id") // added txId in select
      .populate("depositedBy", "name email -_id"),
    Deposit.countDocuments(finalFilter),
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

exports.getInvestments = catchAsync(async (req, res, next) => {
  let { status, startDate, endDate, search, sort } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const filterConditions = [];

  // Filter: status
  if (!status) status = "pending";

  if (status) {
    filterConditions.push({ status });
  }

  // Filter: date range
  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    if (status === "pending" || status === "redeemed") {
      filterConditions.push({
        redeemDate: { $gte: new Date(start), $lte: new Date(end) },
      });
    } else {
      // default: investDate
      filterConditions.push({
        investDate: { $gte: new Date(start), $lte: new Date(end) },
      });
    }
  }

  // Filter: by investment ID through search
  if (search && mongoose.Types.ObjectId.isValid(search)) {
    filterConditions.push({ _id: new mongoose.Types.ObjectId(search) });
  }

  // Sort order (asc or desc)
  const sortOrder = sort === "asc" ? 1 : -1;

  const matchStage = filterConditions.length ? { $and: filterConditions } : {};

  const investments = await mongoose
    .model("User")
    .aggregate([
      { $match: { "investments.0": { $exists: true } } },
      { $unwind: "$investments" },
      { $replaceRoot: { newRoot: "$investments" } },
      { $match: matchStage },
      { $sort: { investDate: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

  const totalCountAgg = await mongoose
    .model("User")
    .aggregate([
      { $match: { "investments.0": { $exists: true } } },
      { $unwind: "$investments" },
      { $replaceRoot: { newRoot: "$investments" } },
      { $match: matchStage },
      { $count: "total" },
    ]);

  const total = totalCountAgg[0]?.total || 0;

  res.status(200).json({
    status: "success",
    results: investments.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      investments,
    },
  });
});

exports.approveUserInvestmentRedemption = catchAsync(async (req, res, next) => {
  const { investmentId } = req.params;

  // Find the user who owns this investment by searching the investments array for investmentId
  const user = await User.findOne({
    "investments._id": investmentId,
    role: "user",
    isDeleted: false,
  });

  if (!user) {
    return next(new AppError("User with this investment not found", 404));
  }

  const investment = user.investments.id(investmentId);

  if (!investment) {
    return next(new AppError("Investment not found", 404));
  }

  if (investment.status === "redeemed") {
    return next(new AppError("Investment already redeemed", 400));
  }

  investment.isManuallyApproved = true;
  investment.status = "redeemed";

  user.withdrawableBalance = new Decimal(user.withdrawableBalance || 0)
    .plus(investment.investedAmount)
    .toDecimalPlaces(6)
    .toNumber();

  //notification
  await Notification.create({
    user: user._id,
    title: "Investment Redeemed",
    message: `Your investment of $${new Decimal(
      investment.investedAmount
    ).toFixed(
      2
    )} has been approved . The amount is now available in your withdrawable balance.`,
  });

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Investment redemption manually approved.",
  });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { name, email, ownerPassword } = req.body;

  // 1. Owner user check
  const ownerUser = await User.findById(userId).select("password role");
  if (!ownerUser) {
    return next(new AppError("Owner user not found.", 404));
  }

  // 2. Role check
  if (ownerUser.role !== "owner") {
    return next(new AppError("Only owner can add admins.", 403));
  }

  // 3. Password check
  const isPasswordCorrect = await ownerUser.verifyPassword(ownerPassword);

  if (!isPasswordCorrect) {
    return next(new AppError("The password you entered is incorrect.", 401));
  }

  // 4. Email already used check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("This email is already taken.", 400));
  }

  // 5. Generate password
  const { token: randomPassword } = generateToken();
  const referralCode = generateReferralCode();
  // 6. Create admin
  const admin = new User({
    name,
    email,
    password: randomPassword,
    role: "admin",
    isVerified: true,
    referralCode: referralCode,
  });

  await admin.save();

  // 7. Send email
  await sendEmail({
    email: admin.email,
    subject: "Admin Account Created",
    greeting: admin.name ? `Hi ${admin.name.trim().split(" ")[0]}` : "",
    heading: "Welcome!",
    message: `
      Your admin account has been created.

      Email: ${admin.email}
      Password: ${randomPassword}

      Please log in and change your password soon.
    `,
    buttonText: "Login",
    buttonUrl: `${config.frontendUrl}/login`,
  });

  res.status(201).json({
    status: "success",
    message: "Admin created! Login details sent to email.",
  });
});

// exports.toggleAdminPriority = catchAsync(async (req, res, next) => {
//   const { adminId } = req.params;

//   const admin = await User.findById(adminId);
//   if (!admin || admin.role !== "admin") {
//     return next(new AppError("Admin not found or invalid role", 404));
//   }

//   if (!admin.priority) {
//     // Case: Assigning priority to this admin
//     // Remove priority from any other admin
//     await User.updateMany(
//       { role: "admin", priority: true, _id: { $ne: adminId } },
//       { $set: { priority: false } }
//     );

//     admin.priority = true;
//     await admin.save();

//     return res.status(200).json({
//       status: "success",
//       message: `Priority has been assigned to admin ${admin.name}.`,
//     });
//   } else {
//     // Case: Trying to remove priority from this admin
//     // Check if there's any other admin with priority
//     const otherPriorityAdmin = await User.findOne({
//       role: "admin",
//       priority: true,
//       _id: { $ne: adminId },
//     });

//     if (!otherPriorityAdmin) {
//       return next(
//         new AppError(
//           "Cannot remove priority as no other admin has priority.",
//           400
//         )
//       );
//     }

//     admin.priority = false;
//     await admin.save();

//     return res.status(200).json({
//       status: "success",
//       message: `Priority has been removed from admin ${admin.name}.`,
//     });
//   }
// });

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { adminId } = req.params;
  const { ownerPassword } = req.body;

  // 1. Owner check
  const ownerUser = await User.findById(userId).select("password role");
  if (!ownerUser || ownerUser.role !== "owner") {
    return next(new AppError("Only owner can delete admins.", 403));
  }

  // 2. Admin existence check
  const adminUser = await User.findById(adminId);
  if (!adminUser || adminUser.role !== "admin") {
    return next(new AppError("Admin not found.", 404));
  }

  // 3. Already deleted check
  if (adminUser.isDeleted) {
    return next(new AppError("Admin already deleted.", 400));
  }

  const isPasswordCorrect = await ownerUser.verifyPassword(ownerPassword);

  if (!isPasswordCorrect) {
    return next(new AppError("The password you entered is incorrect.", 401));
  }

  // 4. Soft delete
  adminUser.isDeleted = true;
  await adminUser.save();

  res.status(200).json({
    status: "success",
    message: "Admin account deleted successfully.",
  });
});

exports.approveWithdrawal = catchAsync(async (req, res, next) => {
  const { withdrawalId } = req.params;
  const { userId } = req.user;

  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal) {
    return next(new AppError("Withdrawal request not found", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 401));
  }

  // ✅ Only owners can approve
  if (user.role !== "owner") {
    return next(
      new AppError("Only owners are allowed to approve this withdrawal", 403)
    );
  }

  // ✅ Prevent duplicate approvals
  if (withdrawal.approvedBy.includes(user._id)) {
    return next(new AppError("You have already approved this request", 400));
  }

  // ✅ Add owner to approvedBy
  withdrawal.approvedBy.push(user._id);

  // ✅ Get all approvers
  const approvers = await User.find({ _id: { $in: withdrawal.approvedBy } });

  // ✅ Count only owners
  const ownerApprovers = approvers.filter((u) => u.role === "owner");

  // ✅ If at least 2 owners approved, process the transfer
  if (ownerApprovers.length >= 2) {
    withdrawal.isApproved = true;

    if (withdrawal.tokenType === "TRC-20") {
      const { success, txId, senderAddress, error } = await transferTRC20(
        withdrawal.toAddress,
        withdrawal.amount
      );

      if (success) {
        withdrawal.status = "completed";
        withdrawal.txId = txId;
        withdrawal.fromAddress = senderAddress;
        await withdrawal.save();

        await Notification.create({
          user: withdrawal.initiatedBy,
          title: "Withdrawal Approved",
          message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.tokenType} has been processed and credited successfully.`,
        });

        return res.status(200).json({
          status: "success",
          message: "Withdrawal approved and transferred successfully",
        });
      } else {
        return res.status(error.statusCode || 500).json({
          message: error.message || "TRC20 transfer failed",
        });
      }
    } else {
      const { success, txId, senderAddress, error } = await transferBEP20(
        withdrawal.toAddress,
        withdrawal.amount
      );

      if (success) {
        withdrawal.status = "completed";
        withdrawal.txId = txId;
        withdrawal.fromAddress = senderAddress;
        await withdrawal.save();

        await Notification.create({
          user: withdrawal.initiatedBy,
          title: "Withdrawal Approved",
          message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.tokenType} has been processed and credited successfully.`,
        });

        return res.status(200).json({
          status: "success",
          message: "Withdrawal approved and transferred successfully",
        });
      } else {
        return res.status(error.statusCode || 500).json({
          message: error.message || "BEP20 transfer failed",
        });
      }
    }
  }

  // ✅ Save partial approval if less than 2 owners
  await withdrawal.save();

  res.status(200).json({
    status: "success",
    message: "Withdrawal approved by owner. Awaiting more approvals.",
  });
});

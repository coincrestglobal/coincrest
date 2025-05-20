const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Withdrawal = require("../models/withdrawalModel");
const Deposit = require("../models/depositModel");
const generateToken = require("../utils/generateToken");
const config = require("../config/config");
const sendEmail = require("../utils/email");
const { transferTRC20 } = require("../services/trc20TransferService");
const { transferBEP20 } = require("../services/bep20TransferService");

exports.getUsers = catchAsync(async (req, res, next) => {
  const { search, role, sort, startDate, endDate } = req.query;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  filter.isDeleted = false;

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

  const sortOption = { createdAt: sort === "desc" ? -1 : 1 };

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select("name email updatedAt rolem priority"),
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
      .select("amount tokenType status toAddress txId createdAt")
      .populate("initiatedBy", "name email -_id")
      .populate("approvedBy", "name _id"),
    Withdrawal.countDocuments(filter),
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
  console.log("meow", isPasswordCorrect);

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

  // 6. Create admin
  const admin = new User({
    name,
    email,
    password: randomPassword,
    role: "admin",
    isVerified: true,
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
    buttonUrl: `${config.frontendUrl}/auth/login`,
  });

  res.status(201).json({
    status: "success",
    message: "Admin created! Login details sent to email.",
  });
});

exports.toggleAdminPriority = catchAsync(async (req, res, next) => {
  const { adminId } = req.params;

  const admin = await User.findById(adminId);
  if (!admin || admin.role !== "admin") {
    return next(new AppError("Admin not found or invalid role", 404));
  }

  admin.priority = !admin.priority;
  await admin.save();

  res.status(200).json({
    status: "success",
    message: `Priority has been ${
      admin.priority ? "assigned to" : "removed from"
    } admin ${admin.name}.`,
  });
});

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

  if (
    user.role !== "owner" &&
    !(user.role === "admin" && user.priority === true)
  ) {
    return next(
      new AppError("You are not authorized to approve this withdrawal", 403)
    );
  }

  if (withdrawal.approvedBy.includes(user._id)) {
    return next(new AppError("You have already approved this request", 400));
  }

  withdrawal.approvedBy.push(user._id);

  const approvers = await User.find({ _id: { $in: withdrawal.approvedBy } });

  const ownerApproved = approvers.some((u) => u.role === "owner");
  const priorityAdminApproved = approvers.some(
    (u) => u.role === "admin" && u.priority === true
  );

  if (ownerApproved && priorityAdminApproved) {
    withdrawal.isApproved = true;

    if (withdrawal.isApproved) {
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

          return res.status(200).json({
            message: "Withdrawal approved and transfered successfully",
          });
        } else {
          return res.status(error.statusCode).json({
            message: error.message,
          });
        }
      } else {
        const { success, txId, senderAddress, error } = await transferBEP20();

        if (success) {
          withdrawal.status = "completed";
          withdrawal.txId = txId;
          withdrawal.fromAddress = senderAddress;
          await withdrawal.save();

          return res.status(200).json({
            message: "Withdrawal approved and transfered successfully",
          });
        } else {
          return res.status(error.statusCode).json({
            message: error.message,
          });
        }
      }
    }
  }

  await withdrawal.save();

  res.status(200).json({
    message: "Withdrawal approved successfully",
  });
});

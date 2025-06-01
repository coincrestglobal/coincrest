const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { checkDaysPassed } = require("../utils/dateUtils");
const User = require("../models/userModel");
const Deposit = require("../models/depositModel");
const Withdrawal = require("../models/withdrawalModel");
const InvestmentPlan = require("../models/investmentPlanmodel");
const Setting = require("../models/settingModel");
const Decimal = require("decimal.js");
const mongoose = require("mongoose");
const {
  MIN_WITHDRAWAL_INTERVAL_DAYS,
  MIN_REDEMPTION_INTERVAL_DAYS,
} = require("../config/constants");
const {
  buildTrc20Url,
  fetchTrc20Transactions,
  filterTrc20Deposits,
} = require("../services/trc20DepositService");
const {
  buildBep20Url,
  fetchBep20Transactions,
  filterBep20Deposits,
} = require("../services/bep20DepositService");
const Notification = require("../models/notificationModel");

exports.getBalance = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const user = await User.findById(userId).select(
    "investableBalance withdrawableBalance"
  );

  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      investableBalance: new Decimal(user.investableBalance)
        .toDecimalPlaces(2)
        .toNumber(),
      withdrawableBalance: new Decimal(user.withdrawableBalance)
        .toDecimalPlaces(2)
        .toNumber(),
    },
  });
});

exports.verifyDeposit = catchAsync(async (req, res, next) => {
  const { tokenType, txId, trxDateTime, password } = req.body;
  const { userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  const isPasswordCorrect = await user.verifyPassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect password. Please try again.", 400));
  }

  let deposit = await Deposit.findOne({ txId });

  if (deposit) {
    if (deposit.isConfirmed) {
      return next(new AppError("This deposit has already been verified.", 400));
    }

    if (deposit.tokenType !== tokenType) {
      return next(
        new AppError(
          `The token type you provided (${tokenType}) does not match the existing record (${deposit.tokenType}).`,
          400
        )
      );
    }
  } else {
    const fromTimestamp = trxDateTime - 30 * 1000,
      maxTimestamp = trxDateTime + 5 * 60 * 1000;

    let transaction = null;

    if (tokenType === "TRC-20") {
      const url = buildTrc20Url(fromTimestamp, maxTimestamp);

      const transactionData = await fetchTrc20Transactions(url, txId);

      if (transactionData.length === 0) {
        return next(
          new AppError(
            "Transaction not found. Please try again after a few minutes. It can take up to 30 minutes to process your deposit.",
            404
          )
        );
      }

      const processedTransaction = filterTrc20Deposits(transactionData);

      transaction = processedTransaction[0];
    } else {
      const url = await buildBep20Url(fromTimestamp, maxTimestamp);

      if (!url) return [];

      const transactionData = await fetchBep20Transactions(url, txId);

      if (transactionData.length === 0) {
        return next(
          new AppError(
            "Transaction not found. Please try again after a few minutes. It can take up to 30 minutes to process your deposit.",
            404
          )
        );
      }

      const processedTransaction = filterBep20Deposits(transactionData);

      transaction = processedTransaction[0];
    }

    deposit = await Deposit.findOneAndUpdate(
      { txId },
      {
        ...transaction,
      },
      {
        new: true,
        upsert: true,
      }
    );
  }

  const isFromAddressBound = user.withdrawalAddresses.some(
    (entry) =>
      entry.tokenType === deposit.tokenType &&
      entry.address.toLowerCase() === deposit.fromAddress.toLowerCase()
  );

  if (!isFromAddressBound) {
    return next(
      new AppError(
        "This deposit doesn't match your bound withdrawal address. Please make sure the wallet used for deposit is the one bound for withdrawals.",
        403
      )
    );
  }

  deposit.isConfirmed = true;
  deposit.depositedBy = userId;
  deposit.verifiedAt = new Date();
  await deposit.save();

  user.investableBalance = new Decimal(user.investableBalance)
    .plus(deposit.amount)
    .toDecimalPlaces(6)
    .toNumber();

  user.deposits.push(deposit._id);
  await user.save();

  await Notification.create({
    user: userId,
    title: "Deposit Verified",
    message: `Your deposit of ${deposit.amount} ${deposit.tokenType} has been successfully verified and added to your investable balance.`,
  });

  if (user.referredBy && !deposit.bonusGiven) {
    const referrer = await User.findOne({ referralCode: user.referredBy });

    if (referrer) {
      const setting = await Setting.findOne({ key: "deposit_bonus" })
        .select("value")
        .lean();
      const bonusRate = setting?.value || 0;
      const bonusAmount = new Decimal(deposit.amount).mul(
        new Decimal(bonusRate).div(100)
      );

      referrer.referralBonuses.push({
        type: "deposit",
        amount: bonusAmount.toDecimalPlaces(6).toNumber(),
        fromUser: user._id,
      });

      referrer.withdrawableBalance = new Decimal(referrer.withdrawableBalance)
        .plus(bonusAmount)
        .toDecimalPlaces(6)
        .toNumber();

      await referrer.save();
      deposit.bonusGiven = true;
      await deposit.save();

      await Notification.create({
        user: referrer._id,
        title: "Referral Bonus Received",
        message: `You received a referral bonus of ${bonusAmount
          .toDecimalPlaces(2)
          .toString()} ${deposit.tokenType} from a referred user's deposit.`,
      });
    }
  }

  res.status(200).json({
    message: "Deposit verified and your balance has been updated successfully.",
  });
});

exports.getDepositHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  let {
    page,
    limit,
    startDate,
    endDate,
    sort = "desc",
    search,
    tokenType,
  } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const skip = (page - 1) * limit;

  const filter = { depositedBy: userId };

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  if (tokenType) {
    filter.tokenType = tokenType;
  }

  if (search) {
    filter.txId = { $regex: search, $options: "i" }; // search only in txId
  }

  const sortOrder = sort === "desc" ? -1 : 1;

  const [deposits, total] = await Promise.all([
    Deposit.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("amount createdAt tokenType txId fromAddress -_id"),
    Deposit.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    page,
    results: deposits.length,
    total,
    totalPages: Math.ceil(total / limit),
    data: { deposits },
  });
});

exports.upsertWithdrawalAddress = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { tokenType, address } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  const addressInUse = await User.findOne({
    "withdrawalAddresses.address": address,
    _id: { $ne: userId }, // Exclude current user
  });

  if (addressInUse) {
    return next(
      new AppError("This address is already in use by another user", 409)
    );
  }

  const existingEntry = user.withdrawalAddresses.find(
    (entry) => entry.tokenType === tokenType
  );

  if (existingEntry) {
    if (existingEntry.address === address) {
      return next(new AppError("This address is already saved", 409));
    }

    // Update the address
    existingEntry.address = address;
  } else {
    // Add new entry
    user.withdrawalAddresses.push({ tokenType, address });
  }

  await user.save();

  await Notification.create({
    user: userId,
    title: existingEntry
      ? "Withdrawal Address Updated"
      : "Withdrawal Address Added",
    message: existingEntry
      ? `Your ${tokenType} withdrawal address has been updated successfully.`
      : `A new ${tokenType} withdrawal address has been added to your account.`,
  });

  res.status(200).json({
    message: existingEntry
      ? "Withdrawal address updated successfully"
      : "Withdrawal address added successfully",
  });
});

exports.getWithdrawalAddresses = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const user = await User.findById(userId).select("withdrawalAddresses");

  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  const sanitizedAddresses = user.withdrawalAddresses.map((addr) => ({
    tokenType: addr.tokenType,
    address: addr.address,
  }));

  res.status(200).json({
    status: "success",
    data: { withdrawalAddresses: sanitizedAddresses },
  });
});

exports.withdraw = catchAsync(async (req, res, next) => {
  const { amount, tokenType, address, password } = req.body;
  const { userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  const isPasswordCorrect = await user.verifyPassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect password", 400));
  }

  const balance = new Decimal(user.withdrawableBalance);
  const withdrawalAmount = new Decimal(amount);

  if (balance.lessThan(withdrawalAmount)) {
    return next(new AppError("Insufficient balance", 400));
  }

  const withdrawalAddress = user.withdrawalAddresses.some(
    (addressObj) =>
      addressObj.tokenType === tokenType && addressObj.address === address
  );

  if (!withdrawalAddress) {
    return next(
      new AppError(
        "This address is not registered in your wallet. Please add it before proceeding.",
        400
      )
    );
  }

  const lastWithdrawalTime = user.lastWithdrawnAt;

  if (lastWithdrawalTime) {
    const { allowed, daysLeft } = checkDaysPassed(
      lastWithdrawalTime,
      MIN_WITHDRAWAL_INTERVAL_DAYS
    );

    if (!allowed) {
      return next(
        new AppError(
          `You can only request a withdrawal once every ${MIN_WITHDRAWAL_INTERVAL_DAYS} days. Please try again after ${daysLeft} day(s).`,
          400
        )
      );
    }
  }

  const withdrawal = new Withdrawal({
    initiatedBy: userId,
    amount: withdrawalAmount.toNumber(),
    toAddress: address,
    tokenType,
    status: "pending",
  });

  await withdrawal.save();

  user.withdrawableBalance = balance
    .minus(withdrawalAmount)
    .toDecimalPlaces(6)
    .toNumber();
  user.lastWithdrawnAt = new Date();

  await user.save();

  await Notification.create({
    user: userId,
    title: "Withdrawal Requested",
    message: `You have successfully requested a withdrawal of ${withdrawal.amount} ${withdrawal.tokenType}. It is currently pending processing.`,
  });

  res.status(200).json({
    status: "success",
    message: "Withdrawal request submitted successfully",
  });
});

exports.getWithdrawalHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  let {
    page,
    limit,
    status,
    startDate,
    endDate,
    sort = "desc",
    search,
  } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const skip = (page - 1) * limit;

  const filter = { initiatedBy: userId };

  if (status) {
    filter.status = status;
  }

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  if (search) {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(search);

    filter.$or = [
      { txId: { $regex: search, $options: "i" } },
      ...(isValidObjectId
        ? [{ _id: new mongoose.Types.ObjectId(search) }]
        : []),
    ];
  }

  const sortOrder = sort === "desc" ? -1 : 1;

  const [withdrawals, total] = await Promise.all([
    Withdrawal.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("amount createdAt status _id txId"),
    Withdrawal.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    page,
    results: withdrawals.length,
    total,
    totalPages: Math.ceil(total / limit),
    data: { withdrawals },
  });
});

exports.investInPlan = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { planId, investedAmount } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  const plan = await InvestmentPlan.findById(planId);
  if (!plan) {
    return next(new AppError("Investment plan not found", 404));
  }

  const investAmount = new Decimal(investedAmount);
  const minAmount = new Decimal(plan.minAmount);
  if (investAmount.lt(minAmount)) {
    return next(
      new AppError(
        `Amount to invest must be greater than or equal to the minimum amount (${minAmount.toFixed(
          2
        )})`,
        400
      )
    );
  }

  const investableBalance = new Decimal(user.investableBalance || 0);
  const withdrawableBalance = new Decimal(user.withdrawableBalance || 0);

  if (investableBalance.plus(withdrawableBalance).lt(investAmount)) {
    return next(
      new AppError(
        `Insufficient balance. You need at least $${investAmount.toFixed(
          2
        )} in your deposit or withdrawal balance.`,
        400
      )
    );
  }

  if (investableBalance.gte(investAmount)) {
    user.investableBalance = investableBalance
      .minus(investAmount)
      .toDecimalPlaces(6)
      .toNumber();
  } else {
    const remainingAmount = investAmount.minus(investableBalance);
    user.investableBalance = 0;
    user.withdrawableBalance = withdrawableBalance
      .minus(remainingAmount)
      .toDecimalPlaces(6)
      .toNumber();
  }

  user.investments.push({
    name: plan.name,
    investedAmount: investAmount.toDecimalPlaces(6).toNumber(),
    interestRate: plan.interestRate,
  });

  await user.save();

  await Notification.create({
    user: userId,
    title: "Investment Successful",
    message: `You have successfully invested $${investAmount
      .toDecimalPlaces(2)
      .toString()} in the "${plan.name}" plan.`,
  });

  return res.status(201).json({
    status: "success",
    message: "Investment successful",
  });
});

exports.getInvestmentHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  let { page, limit, status, startDate, endDate, sort, search } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;

  const user = await User.findById(userId).select("investments").lean();

  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  let investments = user.investments || [];

  if (status) {
    investments = investments.filter(
      (investment) => investment.status === status
    );
  }

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    investments = investments.filter((inv) => {
      const investTime = new Date(inv.investDate).getTime();
      const redeemTime = inv.redeemDate
        ? new Date(inv.redeemDate).getTime()
        : null;

      // include if either falls in range
      return (
        (investTime >= start && investTime <= end) ||
        (redeemTime && redeemTime >= start && redeemTime <= end)
      );
    });
  }

  if (search) {
    const searchLower = search.toLowerCase();
    investments = investments.filter((inv) =>
      inv.name.toLowerCase().includes(searchLower)
    );
  }

  investments = investments.map(({ profit, ...rest }) => ({
    ...rest,
    profit: new Decimal(profit).toDecimalPlaces(2).toNumber(),
  }));

  investments = investments.sort((a, b) => {
    const aDate =
      a.status === "redeemed" || a.status === "pending"
        ? new Date(a.redeemDate)
        : new Date(a.investDate);
    const bDate =
      b.status === "redeemed" || b.status === "pending"
        ? new Date(b.redeemDate)
        : new Date(b.investDate);

    return sort === "desc" ? bDate - aDate : aDate - bDate;
  });

  const total = investments.length;
  const startIndex = (page - 1) * limit;
  investments = investments.slice(startIndex, startIndex + limit);

  res.status(200).json({
    status: "success",
    page,
    results: investments.length,
    total,
    totalPages: Math.ceil(total / limit),
    data: { investments },
  });
});

exports.redeemInvestment = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { investmentId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  const investment = user.investments.id(investmentId);
  if (!investment) {
    return next(new AppError("Investment not found", 404));
  }

  if (investment.status === "redeemed") {
    return next(new AppError("Investment is already redeemed", 400));
  }

  const { allowed, daysLeft } = checkDaysPassed(
    investment.investDate,
    MIN_REDEMPTION_INTERVAL_DAYS
  );

  if (!allowed) {
    return next(
      new AppError(
        `You can redeem this investment after ${MIN_REDEMPTION_INTERVAL_DAYS} day(s). Please try again in ${daysLeft} day(s).`,
        400
      )
    );
  }

  investment.status = "pending";
  investment.redeemDate = new Date();
  await user.save();

  await Notification.create({
    user: userId,
    title: "Investment Redeemed",
    message: `You have successfully redeemed your investment of $${new Decimal(
      investment.investedAmount
    )
      .toDecimalPlaces(2)
      .toString()}. The amount will remain reflected in your account for 15 days before it becomes withdrawable.`,
  });

  return res.status(200).json({
    status: "success",
    message: "Investment redeemed successfully",
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

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Investment redemption manually approved.",
  });
});

exports.getReferredUsers = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  const referredUsers = await User.find({
    referredBy: user.referralCode,
  })
    .sort({ createdAt: -1 })
    .select("name email");

  res.json({
    status: "success",
    message: "Referred users fetched successfully",
    data: { referredUsers },
  });
});

exports.getReferralBonusHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new AppError("Invalid user ID", 400));
  }

  const user = await User.findById(userId).select("referralBonuses").lean();

  const totalBonuses = user.referralBonuses.length;

  const sortedBonuses = user.referralBonuses
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(skip, skip + limit);

  res.status(200).json({
    status: "success",
    page,
    limit,
    totalBonuses,
    totalPages: Math.ceil(totalBonuses / limit),
    data: { bonuses: sortedBonuses },
  });
});

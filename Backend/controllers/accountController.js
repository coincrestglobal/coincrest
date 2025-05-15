const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { checkDaysPassed } = require("../utils/dateUtils");
const User = require("../models/userModel");
const Deposit = require("../models/depositModel");
const Withdrawal = require("../models/withdrawalModel");
const InvestmentPlan = require("../models/investmentPlanmodel");
const Decimal = require("decimal.js");
const {
  MIN_WITHDRAWAL_INTERVAL_DAYS,
  MIN_REDEMPTION_INTERVAL_DAYS,
} = require("../config/constants");
const {
  buildTrc20Url,
  fetchTrc20Transactions,
  filterTrc20Deposits,
} = require("../services/trc20TransactionsServices");

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
      investableBalance: user.investableBalance,
      withdrawableBalance: user.withdrawableBalance,
    },
  });
});

exports.verifyDeposit = catchAsync(async (req, res, next) => {
  const { tokenType, txId, trxDateTime, password } = req.body;
  const { userId } = req.user;

  // Step 1: Find user
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Access denied. User account not found.", 401));
  }

  // Step 2: Verify password
  const isPasswordCorrect = await user.verifyPassword(password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect password. Please try again.", 400));
  }

  // Step 3: Check if deposit already exists in DB
  let deposit = await Deposit.findOne({ txId });

  if (deposit) {
    if (deposit.isConfirmed) {
      return next(new AppError("This deposit has already been verified.", 400));
    }
  } else {
    // Step 4: Fetch from blockchain
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

      // Step 5: Process the transaction
      const processedTransaction = filterTrc20Deposits(transactionData);

      // Step 6: Validate it's a deposit
      transaction = processedTransaction[0];
    } else {
      return res
        .status(401)
        .json({ status: "fail", message: "abi nhi h re bep20" });
    }
    // Step 7: Save it in DB
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

  // Step 8: Confirm deposit & update balance
  deposit.isConfirmed = true;
  deposit.depositedBy = userId;
  deposit.verifiedAt = new Date();
  await deposit.save();

  user.investableBalance = new Decimal(user.investableBalance)
    .plus(deposit.amount)
    .toNumber();
  user.deposits.push(deposit._id);
  await user.save();

  // Step 9: Respond
  res.status(200).json({
    message: "Deposit verified and your balance has been updated successfully.",
  });
});

exports.getDepositHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const sortOrder = req.query.sort === "desc" ? -1 : 1;

  const [deposits, total] = await Promise.all([
    Deposit.find({ depositedBy: userId })
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("amount createdAt tokenType -_id"),
    Deposit.countDocuments({ depositedBy: userId }),
  ]);

  if (page > 1 && deposits.length === 0) {
    return next(new AppError("No more deposit history found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: deposits,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
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
    withdrawalAddresses: sanitizedAddresses,
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

  // Subtract using Decimal
  user.withdrawableBalance = balance.minus(withdrawalAmount).toNumber();
  user.lastWithdrawnAt = new Date();

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Withdrawal request submitted successfully",
  });
});

exports.getWithdrawalHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const sortOrder = req.query.sort === "desc" ? -1 : 1;

  const [withdrawals, total] = await Promise.all([
    Withdrawal.find({ initiatedBy: userId }) // or `userId` if that's the field
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("amount createdAt status requestedAt -_id"),
    Withdrawal.countDocuments({ initiatedBy: userId }),
  ]);

  if (page > 1 && withdrawals.length === 0) {
    return next(new AppError("No more withdrawal history found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: withdrawals,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
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
    user.investableBalance = investableBalance.minus(investAmount).toNumber();
  } else {
    const remainingAmount = investAmount.minus(investableBalance);
    user.investableBalance = 0;
    user.withdrawableBalance = withdrawableBalance
      .minus(remainingAmount)
      .toNumber();
  }

  user.investments.push({
    name: plan.name,
    investedAmount: investAmount.toDecimalPlaces(2).toNumber(),
    interestRate: plan.interestRate,
  });

  await user.save();

  return res.status(201).json({
    status: "success",
    message: "Investment successful",
  });
});

exports.getInvestmentHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { status, sort } = req.query;

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

  investments = investments.sort((a, b) => {
    const aDate =
      a.status === "redeemed" ? new Date(a.redeemDate) : new Date(a.investDate);
    const bDate =
      b.status === "redeemed" ? new Date(b.redeemDate) : new Date(b.investDate);

    return sort === "desc" ? bDate - aDate : aDate - bDate;
  });

  res.status(200).json({
    success: true,
    total: investments.length,
    data: investments,
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

  investment.status = "redeemed";
  investment.redeemDate = new Date();
  user.withdrawableBalance = new Decimal(user.withdrawableBalance)
    .plus(new Decimal(investment.investedAmount))
    .plus(new Decimal(investment.profit || 0))
    .toNumber();

  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Investment redeemed successfully",
  });
});

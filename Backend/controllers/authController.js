const config = require("../config/config");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/email");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// url variables
const emailVerificationUrl = config.frontendUrl + "/verify-email/";
const passwordResetUrl = config.frontendUrl + "/reset-password/";

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser = await User.findOne({ email });

  if (existingUser && existingUser.role === "admin" && existingUser.isDeleted) {
    return next(
      new AppError("Signup is not allowed with this admin account email.", 403)
    );
  }

  if (existingUser) {
    if (existingUser.isDeleted) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.isDeleted = false;
      existingUser.isVerified = false;

      // ✅ Add token
      const { token, tokenExpiresIn } = generateToken(30);
      existingUser.emailVerificationToken = token;
      existingUser.emailVerificationTokenExpires = tokenExpiresIn;

      await existingUser.save();

      // ✅ Send verification email again
      await sendEmail({
        email: existingUser.email,
        subject: "Please verify your email",
        message: "Please verify your email by clicking the button below.",
        heading: "Verify Your Email",
        buttonText: "Verify Email",
        buttonUrl: emailVerificationUrl + existingUser.emailVerificationToken,
      });

      return res.status(200).json({
        status: "success",
        message: "Account reactivated. Please verify your email.",
      });
    }

    return next(new AppError("User already exists with this email.", 400));
  }

  const user = await User.create({ name, email, password });

  const { token, tokenExpiresIn } = generateToken(30);
  user.emailVerificationToken = token;
  user.emailVerificationTokenExpires = tokenExpiresIn;

  await user.save();

  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    message: "Please verify your email by clicking the button below.",
    heading: "Verify Your Email",
    buttonText: "Verify Email",
    buttonUrl: emailVerificationUrl + user.emailVerificationToken,
  });

  res.status(201).json({
    status: "success",
    message: "Signup successful. Please verify your email.",
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({
    emailVerificationToken: token,
    isDeleted: false,
  });

  if (!user) {
    return next(new AppError("Invalid verification link.", 400));
  }

  if (user.emailVerificationTokenExpires < Date.now()) {
    // Token expired - generate a new one
    const { token, tokenExpiresIn } = generateToken(30);

    user.emailVerificationToken = token;
    user.emailVerificationTokenExpires = tokenExpiresIn;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: "Your new verification link",
      message: "Please verify your email by clicking the button below.",
      heading: "Verify Your Email",
      buttonText: "Verify Email",
      buttonUrl: emailVerificationUrl + user.emailVerificationToken,
    });

    return next(
      new AppError(
        "Your verification link expired. We have sent you a new link on your email.",
        400
      )
    );
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Email verified successfully.",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user || user.isDeleted) {
    return next(new AppError("No user found with this email.", 404)); // User not found
  }

  // Check if the user has verified their email
  if (!user.isVerified) {
    if (user.emailVerificationTokenExpires < Date.now()) {
      // Token expired - generate a new one
      const { token, tokenExpiresIn } = generateToken(30);

      user.emailVerificationToken = token;
      user.emailVerificationTokenExpires = tokenExpiresIn;
      await user.save({ validateBeforeSave: false });

      await sendEmail({
        email: user.email,
        subject: "Email Verification Link",
        message:
          "Your previous verification link has expired. Please verify your email using the new link below.",
        heading: "Verify Your Email",
        buttonText: "Verify Email",
        buttonUrl: emailVerificationUrl + user.emailVerificationToken,
      });
    }

    return next(
      new AppError(
        "Your email is not verified yet. Please check your inbox to verify your email before logging in.",
        400
      )
    );
  }

  // Check if the password is correct
  const correctPassword = await user.verifyPassword(password);
  if (!correctPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtTokenExpiresIn,
  });

  // 3. Set cookie with token
  res.cookie("jwt", token, {
    httpOnly: true, // prevent client JS access
    secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
    sameSite: "Strict", // CSRF protection
    maxAge: Number(config.jwtTokenExpiresIn.slice(0, -1)) * 24 * 60 * 60 * 1000, // removed d from duration (eg 90d)
  });

  // Send the token as response
  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    data: { token },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.isDeleted) {
    return next(new AppError("No user found with this email address", 404));
  }

  const { token, tokenExpiresIn } = generateToken(30);

  user.passwordResetToken = token;
  user.passwordResetTokenExpires = tokenExpiresIn;
  await user.save();

  await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    greeting: user?.name ? `Hello ${user.name.trim().split(" ")[0]}` : "",
    message:
      "We received a request to reset your password. Click the button below to reset it.",
    heading: "Forgot Your Password?",
    buttonText: "Reset Password",
    buttonUrl: passwordResetUrl + user.passwordResetToken,
  });

  res.status(200).json({
    status: "success",
    message: "Password reset link sent to your email.",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ passwordResetToken: token });
  if (!user || user.passwordResetTokenExpires < Date.now() || user.isDeleted) {
    return next(
      new AppError(
        "The reset link is invalid or has expired. Please request a new one.",
        400
      )
    );
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully. You can now log in.",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (!user || user.isDeleted) {
    return next(new AppError("Account not found or deleted.", 404));
  }

  const correctPassword = await user.verifyPassword(currentPassword);
  if (!correctPassword) {
    return next(new AppError("Incorrect current password", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully.",
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Account not found.", 404));
  }

  // ✅ Password check
  const correctPassword = await user.verifyPassword(password);
  if (!correctPassword) {
    return next(new AppError("Incorrect password. Please try again.", 401));
  }

  // ✅ Balance check
  const investable = new Decimal(user.investableBalance || 0);
  const withdrawable = new Decimal(user.withdrawableBalance || 0);
  const totalBalance = investable.plus(withdrawable);

  if (!totalBalance.equals(0)) {
    return next(
      new AppError(
        "You must withdraw all your funds before deleting your account.",
        400
      )
    );
  }

  // ✅ Pending withdrawal check
  const pendingWithdrawals = await Withdrawal.find({
    initiatedBy: user._id,
    status: { $in: ["pending", "processing"] },
  });

  if (pendingWithdrawals.length > 0) {
    return next(
      new AppError(
        "You have pending withdrawal requests. Please wait for them to complete before deleting your account.",
        400
      )
    );
  }

  // ✅ Soft delete the account
  user.isDeleted = true;
  await user.save();

  // Clear the JWT cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(204).json({
    status: "success",
    message: "Your account has been successfully deleted.",
  });
});

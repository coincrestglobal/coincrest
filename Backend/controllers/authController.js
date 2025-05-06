const config = require("../config/config");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (expiresInMinutes = 15) => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiresIn = Date.now() + expiresInMinutes * 60 * 1000;
  return { token, tokenExpiresIn };
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists with this email.", 400));
  }

  const user = await User.create({ email, password });

  // Generate email verification token
  const { token, tokenExpiresIn } = generateToken(30);

  user.emailVerificationToken = token;
  user.emailVerificationTokenExpires = tokenExpiresIn;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    message: "Please verify your email by clicking the button below.",
    heading: "Verify Your Email",
    buttonText: "Verify Email",
    buttonUrl: `${config.frontendUrl}/auth/verify-email/${user.emailVerificationToken}`,
  });

  res.status(201).json({
    status: "success",
    message: "Signup successful. Please verify your email.",
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({ emailVerificationToken: token });

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
      buttonUrl: `${config.frontendUrl}/auth/verify-email/${user.emailVerificationToken}`,
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
  if (!user) {
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
        buttonUrl: `${config.frontendUrl}/auth/verify-email/${user.emailVerificationToken}`,
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

  // Generate a JWT token
  const token = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtTokenExpiresIn,
  });

  // Send the token as response
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user found with this email address", 404));
  }

  const { token, tokenExpiresIn } = generateToken(30);

  user.passwordResetToken = token;
  user.passwordResetTokenExpires = tokenExpiresIn;
  await user.save();

  await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    message:
      "We received a request to reset your password. Click the button below to reset it.",
    heading: "Forgot Your Password?",
    buttonText: "Reset Password",
    buttonUrl: `${config.frontendUrl}/auth/reset-password/${user.passwordResetToken}`,
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
  if (!user || user.passwordResetTokenExpires < Date.now()) {
    return next(new AppError("The reset link has expired or is invalid.", 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully.",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.user;

  const user = await User.findById(userId);

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

  const correctPassword = await user.verifyPassword(password);
  if (!correctPassword) {
    return next(new AppError("Incorrect password, cannot delete account", 401));
  }

  // Check if user's balance is 0
  if (user.balance !== 0) {
    return next(new AppError("User balance must be 0 before deletion.", 400));
  }

  // Check if the user has any pending withdrawal requests
  const pendingWithdrawals = await Withdrawal.find({
    user: user._id,
    status: "processing", // Assuming 'processing' is the status for pending withdrawals
  });

  if (pendingWithdrawals.length > 0) {
    return next(
      new AppError(
        "User has pending withdrawals. Cannot delete until processed.",
        400
      )
    );
  }

  await user.deleteOne({ _id: user._id });

  res.status(204).json({
    status: "success",
    message: "Account deleted successfully.",
  });
});

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config/config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to continue.", 401)
    );
  }

  const decoded = jwt.verify(token, config.jwtSecret);

  const user = await User.findById(decoded.id).select(
    "role isDeleted currentLoginToken"
  );

  if (!user || user.isDeleted) {
    return next(
      new AppError("Your session is no longer valid. Please log in again.", 401)
    );
  }

  // 🔐 Single device login check
  if (user.currentLoginToken !== token) {
    return res.status(401).json({
      status: "fail",
      message: "You have been logged out from this device. Please login again.",
      isOldDevice: true,
    });
  }

  req.user = { userId: decoded.id, role: user.role };

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. You don't have permission to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

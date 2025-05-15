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

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return next(
      new AppError("Your session has expired. Please log in again.", 401)
    );
  }

  req.user = { userId: decoded.id, role: user.role };

  next();
});

// Middleware to authorize specific roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Your role (${req.user.role}) does not have permission to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

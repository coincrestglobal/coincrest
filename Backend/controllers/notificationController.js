const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const notifications = await Notification.find({ user: userId })
    .sort({ isRead: 1, createdAt: -1 })
    .lean();

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: { notifications },
  });
});

exports.markNotificationAsRead = catchAsync(async (req, res, next) => {
  const { notificationId } = req.params;
  const { userId } = req.user;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true }
  );

  if (!notification) {
    return next(new AppError("Notification not found or not authorized", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Notification marked as read",
  });
});

exports.hasUnreadNotification = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const exists = await Notification.exists({ user: userId, isRead: false });

  res.status(200).json({
    status: "success",
    data: { hasUnread: !!exists },
  });
});

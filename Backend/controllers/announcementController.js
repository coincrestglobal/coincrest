const catchAsync = require("../utils/catchAsync");
const Announcement = require("../models/announcementModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.createAnnouncement = catchAsync(async (req, res, next) => {
  const { userId, role } = req.user;
  const { title, message } = req.body;

  let visibleTo;
  if (role === "admin") {
    visibleTo = "user";
  } else {
    visibleTo = req.body.visibleTo;
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const announcement = await Announcement.create({
    title,
    message,
    visibleTo,
    createdBy: userId,
    expiresAt,
  });

  if (visibleTo === "user" || visibleTo === "all") {
    const users = await User.find(
      { role: "user", isDeleted: false },
      "_id"
    ).lean();

    const notifications = users.map((user) => ({
      user: user._id,
      title,
      message,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  }

  res.status(201).json({
    status: "success",
    message: "Your announcement has been published.",
  });
});

exports.getAnnouncements = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  // Pagination params
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const { sort = "desc", startDate, endDate, search } = req.query;

  const sortOrder = sort === "desc" ? -1 : 1;

  // Build role-based visibility filter
  let roleFilter = {};
  if (role === "admin") {
    roleFilter = {
      $or: [
        { visibleTo: "admin" },
        { visibleTo: "all" },
        { createdBy: userId },
      ],
    };
  } else if (role === "user") {
    roleFilter = {
      $or: [{ visibleTo: "user" }, { visibleTo: "all" }],
    };
  }

  // Build search filter (on title or message)
  let searchFilter = {};
  if (search) {
    searchFilter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ],
    };
  }

  // Build final filter combining role, search, and date filters
  let filterConditions = [roleFilter];

  if (search) {
    filterConditions.push(searchFilter);
  }

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    filterConditions.push({
      createdAt: { $gte: start, $lte: end },
    });
  }

  const finalFilter =
    filterConditions.length > 1
      ? { $and: filterConditions }
      : filterConditions[0];

  // Total count for pagination metadata
  const totalAnnouncements = await Announcement.countDocuments(finalFilter);

  const announcements = await Announcement.find(finalFilter)
    .sort({ createdAt: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name")
    .lean();

  const result = announcements.map((a) => {
    const createdBySelf = a.createdBy?._id?.toString() === userId.toString();

    return {
      ...a,
      createdBy:
        role === "owner"
          ? createdBySelf
            ? "You"
            : a.createdBy?.name
          : undefined,
    };
  });

  res.status(200).json({
    status: "success",
    message: "Announcements fetched successfully",
    results: result.length,
    page,
    totalPages: Math.ceil(totalAnnouncements / limit),
    total: totalAnnouncements,
    data: { announcements: result },
  });
});

exports.deleteAnnouncement = catchAsync(async (req, res, next) => {
  const { userId, role } = req.user;
  const { announcementId } = req.params;

  // Check if announcement exists
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    return next(new AppError("Announcement not found", 404));
  }

  // Check permissions
  const isOwner = role === "owner";
  const isCreator = announcement.createdBy?.toString() === userId.toString();

  if (isOwner || isCreator) {
    await Announcement.findByIdAndDelete(announcementId);
    return res.status(200).json({
      status: "success",
      message: "Announcement deleted successfully",
    });
  }

  return next(
    new AppError("You are not authorized to delete this announcement", 403)
  );
});

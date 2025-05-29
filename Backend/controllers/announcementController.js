const catchAsync = require("../utils/catchAsync");
const Announcement = require("../models/announcementModel");
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

  await Announcement.create({
    title,
    message,
    visibleTo,
    createdBy: userId,
    expiresAt,
  });

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
  const { sort = "desc", startDate, endDate } = req.query;

  // Filter logic based on role
  let filter = {};

  if (role === "admin") {
    filter = {
      $or: [{ visibleTo: "admin" }, { createdBy: userId }],
    };
  } else if (role === "user") {
    filter = {
      visibleTo: role,
    };
  }
  const sortOrder = sort === "desc" ? -1 : 1;

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  // Total count for pagination metadata
  const totalAnnouncements = await Announcement.countDocuments(filter);

  const announcements = await Announcement.find(filter)
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

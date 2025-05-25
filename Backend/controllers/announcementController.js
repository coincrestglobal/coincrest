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

  let filter = {};

  if (role === "owner") {
    // Owner sees all announcements
    filter = {};
  } else if (role === "admin") {
    // Admins see announcements visible to admins or created by themselves
    filter = {
      $or: [{ visibleTo: "admin" }, { createdBy: userId }],
    };
  } else if (role === "user") {
    // Normal users see only those announcements meant for them
    filter = {
      visibleTo: role,
    };
  }

  const announcements = await Announcement.find(filter)
    .sort({ createdAt: -1 })
    .populate("createdBy", "name")
    .lean();

  const result = announcements.map((a) => {
    const createdBySelf = a.createdBy._id?.toString() === userId.toString();

    return {
      ...a,
      createdBy:
        role === "owner"
          ? createdBySelf
            ? "You"
            : a.createdBy.name
          : undefined,
    };
  });

  res.status(200).json({
    status: "success",
    message: "Announcements fetched successfully",
    results: result.length,
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

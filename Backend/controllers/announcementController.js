const Announcement = require("../models/announcementModel");

exports.createAnnouncement = async (req, res) => {
  const { userId } = req.user;
  const { title, message, messageTo } = req.body;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await Announcement.create({
    title,
    message,
    messageTo,
    createdBy: userId,
    expiresAt,
  });

  // TODO: Send email to users based on roles in visibleTo

  res.status(201).json({ status: "success", message: "Announcement created" });
};

exports.getAnnouncements = async (req, res) => {
  const { userId } = req.user;

  let filter = {};

  if (user.role === "owner") {
    // owner sees all
    filter = {};
  } else if (user.role === "admin") {
    filter = {
      $or: [{ visibmessageToleTo: "admin" }, { createdBy: user._id }],
    };
  } else {
    filter = {
      visibleTo: user.role,
    };
  }

  const announcements = await Announcement.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const result = announcements.map((a) => {
    const createdBySelf = a.createdBy?.toString() === user._id.toString();
    return {
      ...a,
      createdBy:
        user.role === "owner"
          ? createdBySelf
            ? "You"
            : a.createdBy
          : undefined,
    };
  });

  res.json(result);
};

// DELETE
exports.deleteAnnouncement = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const announcement = await Announcement.findById(id);

  if (!announcement) return res.status(404).json({ message: "Not found" });

  const isOwner = user.role === "owner";
  const isCreator = announcement.createdBy.toString() === user._id.toString();

  if (isOwner || (user.role === "admin" && isCreator)) {
    await Announcement.findByIdAndDelete(id);
    return res.json({ message: "Deleted successfully" });
  }

  res.status(403).json({ message: "Not allowed" });
};

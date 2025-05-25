const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  visibleTo: {
    type: [String],
    enum: ["user", "admin", "all"],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

announcementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Announcement", announcementSchema);

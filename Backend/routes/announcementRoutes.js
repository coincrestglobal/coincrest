const express = require("express");

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

const {
  createAnnouncementValidator,
} = require("../validations/announcement.validation");

const router = express.Router();

router.post(
  "/",
  restrictTo("owner", "admin"),
  createAnnouncementValidator,
  createAnnouncement
);

router.get("/", getAnnouncements);

router.delete("/:id", restrictTo("owner", "admin"), deleteAnnouncement);

module.exports = router;

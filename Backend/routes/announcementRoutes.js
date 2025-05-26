const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const announcementValidator = require("../validators/announcementValidator");
const announcementController = require("../controllers/announcementController");

const router = express.Router();

router.post(
  "/create",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  announcementValidator.createAnnouncementValidator,
  announcementController.createAnnouncement
);

router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user", "admin", "owner"),
  announcementController.getAnnouncements
);

router.delete(
  "/:announcementId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  announcementController.deleteAnnouncement
);

module.exports = router;

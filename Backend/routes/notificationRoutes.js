const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.get(
  "/",
  authMiddleware.protect,
  notificationController.getUserNotifications
);

router.patch(
  "/markRead/:notificationId",
  authMiddleware.protect,
  notificationController.markNotificationAsRead
);

router.get(
  "/hasUnread",
  authMiddleware.protect,
  notificationController.hasUnreadNotification
);

module.exports = router;

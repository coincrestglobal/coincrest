const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const statsController = require("../controllers/statsController");

const router = express.Router();

router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  statsController.getStats
);

router.get(
  "/statCount",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  statsController.getTotalCounts
);

module.exports = router;

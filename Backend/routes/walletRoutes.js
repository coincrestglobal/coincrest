const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const walletController = require("../controllers/walletController");

const router = express.Router();

router.get(
  "/getDepositAddresses",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  walletController.getDepositAddress
);

module.exports = router;

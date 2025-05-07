const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const accountValidator = require("../validators/accountValidator");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.get("/balance", authMiddleware.protect, accountController.getBalance);

router.post(
  "/verifyDeposit",
  authMiddleware.protect,
  accountValidator.validateVerifyDeposit,
  accountController.verifyDeposit
);

router.get(
  "/deposits",
  authMiddleware.protect,
  accountController.getDepositHistory
);

router.post(
  "/upsertWithdrawalAddress",
  authMiddleware.protect,
  accountValidator.validateAddWithdrawalAddress,
  accountController.upsertWithdrawalAddress
);

router.get(
  "/withdrawalAddresses",
  authMiddleware.protect,
  accountController.getWithdrawalAddresses
);

router.post(
  "/withdraw",
  authMiddleware.protect,
  accountValidator.withdrawalValidator,
  accountController.withdraw
);

router.get(
  "/withdraw",
  authMiddleware.protect,
  accountController.getWithdrawalHistory
);

router.post(
  "/invest",
  authMiddleware.protect,
  accountValidator.validateInvestment,
  accountController.investInPlan
);

router.get(
  "/getInvestments",
  authMiddleware.protect,
  accountController.getInvestmentHistory
);

module.exports = router;

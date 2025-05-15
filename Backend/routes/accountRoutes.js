const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const accountValidator = require("../validators/accountValidator");
const queryParamsValidator = require("../validators/queryParamsValidator");
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
  queryParamsValidator,
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
  queryParamsValidator,
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
  queryParamsValidator,
  accountController.getInvestmentHistory
);

router.patch(
  "/redeem/:investmentId",
  authMiddleware.protect,
  accountController.redeemInvestment
);

module.exports = router;

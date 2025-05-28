const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const accountValidator = require("../validators/accountValidator");
const queryParamsValidator = require("../validators/queryParamsValidator");
const paginationValidator = require("../validators/paginationValidator");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.get(
  "/balance",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountController.getBalance
);

router.post(
  "/verifyDeposit",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountValidator.validateVerifyDeposit,
  accountController.verifyDeposit
);

router.get(
  "/deposits",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  queryParamsValidator,
  paginationValidator,
  accountController.getDepositHistory
);

router.post(
  "/upsertWithdrawalAddress",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountValidator.validateAddWithdrawalAddress,
  accountController.upsertWithdrawalAddress
);

router.get(
  "/withdrawalAddresses",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountController.getWithdrawalAddresses
);

router.post(
  "/withdraw",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountValidator.withdrawalValidator,
  accountController.withdraw
);

router.get(
  "/withdraw",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  queryParamsValidator,
  paginationValidator,
  accountController.getWithdrawalHistory
);

router.post(
  "/invest",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountValidator.validateInvestment,
  accountController.investInPlan
);

router.get(
  "/getInvestments",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  queryParamsValidator,
  paginationValidator,
  accountController.getInvestmentHistory
);

router.patch(
  "/redeem/:investmentId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountController.redeemInvestment
);

router.get(
  "/getReferredUsers",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  accountController.getReferredUsers
);

router.get(
  "/getReferralBonus/:userId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  queryParamsValidator,
  accountController.getReferralBonusHistory
);

module.exports = router;

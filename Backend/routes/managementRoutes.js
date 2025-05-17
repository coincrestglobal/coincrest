const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const queryParamsValidator = require("../validators/queryParamsValidator");
const paginationValidator = require("../validators/paginationValidator");
const managementController = require("../controllers/managementController");

const router = express.Router();

router.get(
  "/getUsers",
  // authMiddleware.protect,
  queryParamsValidator,
  paginationValidator,
  managementController.getUsers
);

router.get(
  "/getUser",
  // authMiddleware.protect,
  managementController.getUserById
);

router.get(
  "/getWithdrawals",
  authMiddleware.protect,
  queryParamsValidator,
  paginationValidator,
  managementController.getWithdrawals
);

router.get(
  "/getDeposits",
  authMiddleware.protect,
  queryParamsValidator,
  paginationValidator,
  managementController.getDeposits
);

module.exports = router;

const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const queryParamsValidator = require("../validators/queryParamsValidator");
const paginationValidator = require("../validators/paginationValidator");
const managementController = require("../controllers/managementController");

const router = express.Router();

router.get(
  "/withdrawals",
  authMiddleware.protect,
  queryParamsValidator,
  paginationValidator,
  managementController.getWithdrawals
);

module.exports = router;

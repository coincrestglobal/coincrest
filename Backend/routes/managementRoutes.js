const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const queryParamsValidator = require("../validators/queryParamsValidator");
const paginationValidator = require("../validators/paginationValidator");
const managementController = require("../controllers/managementController");
const managementValidator = require("../validators/managementValidator");

const router = express.Router();

router.get(
  "/getUsers",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  queryParamsValidator,
  paginationValidator,
  managementController.getUsers
);

router.get(
  "/getUser",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  managementController.getUserById
);

router.get(
  "/getWithdrawals",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  queryParamsValidator,
  paginationValidator,
  managementController.getWithdrawals
);

router.get(
  "/getDeposits",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  queryParamsValidator,
  paginationValidator,
  managementController.getDeposits
);

router.post(
  "/createAdmin",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("owner"),
  managementValidator.createAdminValidator,
  managementController.createAdmin
);

// router.patch(
//   "/togglePriority/:adminId",
//   authMiddleware.protect,
//   authMiddleware.authorizeRoles("owner"),
//   managementController.toggleAdminPriority
// );

router.patch(
  "/deleteAdmin/:adminId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("owner"),
  managementValidator.deleteAdminValidator,
  managementController.deleteAdmin
);

router.patch(
  "/approveWithdrawal/:withdrawalId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("owner"),
  managementController.approveWithdrawal
);

module.exports = router;

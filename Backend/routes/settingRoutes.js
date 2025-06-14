const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const settingValidator = require("../validators/settingValidator");
const settingController = require("../controllers/settingController");

const router = express.Router();

router.patch(
  "/updateDepositBonus",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  settingValidator.validateDepositBonus,
  settingController.updateDepositBonus
);

router.patch(
  "/updateTeamBonus",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  settingValidator.validateTeamBonus,
  settingController.updateTeamBonus
);

router.get("/getDepositBonus", settingController.getDepositBonus);

router.get("/getTeamBonus", settingController.getTeamBonus);

module.exports = router;

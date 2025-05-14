const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const investmentPlanValidator = require("../validators/investmentPlanValidator");
const investmentPlanController = require("../controllers//investmentPlanController");

const router = express.Router();

router.get(
  "/",
  // authMiddleware.protect,
  investmentPlanController.getPlans
);

router.post(
  "/create",
  // authMiddleware.protect,
  investmentPlanValidator.validateNewInvestmentPlan,
  investmentPlanController.createInvestmentPlan
);

router.patch(
  "/update/:planId",
  authMiddleware.protect,
  investmentPlanValidator.validateUpdateInvestmentPlan,
  investmentPlanController.updateInvestmentPlan
);

module.exports = router;

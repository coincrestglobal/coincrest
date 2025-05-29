const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const privacyController = require("../controllers/privacyPolicyController");
const privacyPolicyValidator = require("../validators/privacyPolicyValidator");

const router = express.Router();

router.post(
  "/create",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  privacyPolicyValidator.validateCreatePrivacy,
  privacyController.createPrivacy
);

router.get("/", privacyController.getPrivacy);

router.delete(
  "/delete/:policyId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  privacyController.deletePrivacy
);

module.exports = router;

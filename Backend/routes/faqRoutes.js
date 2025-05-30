const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const faqController = require("../controllers/faqController");
const faqValidator = require("../validators/faqValidator");

const router = express.Router();

router.post(
  "/create",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  faqValidator.validateCreateFAQ,
  faqController.createFaq
);

router.get("/", faqController.getFaqs);

router.delete(
  "/delete/:faqId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  faqController.deleteFaq
);

module.exports = router;

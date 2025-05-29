const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const termsController = require("../controllers/termsController");
const termsValidator = require("../validators/termsValidator");

const router = express.Router();

router.post(
  "/create",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  termsValidator.validateCreateTerms,
  termsController.createTerms
);

router.get("/", termsController.getTerms);

router.delete(
  "/delete/:termId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  termsController.deleteTerms
);

module.exports = router;

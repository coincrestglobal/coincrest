const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");

const router = express.Router();

router.post("/signup", authValidator.signupValidator, authController.signup);
router.get("/verify/:token", authController.verifyEmail);
router.post("/login", authValidator.loginValidator, authController.login);
router.post(
  "/forgotPassword",
  authValidator.forgotPasswordValidator,
  authController.forgotPassword
);
router.patch(
  "/resetPassword/:token",
  authValidator.resetPasswordValidator,
  authController.resetPassword
);
router.patch(
  "/updateMyPassword",
  authMiddleware.protect,
  authValidator.updatePasswordValidator,
  authController.updatePassword
);
router.delete(
  "/deleteAccount",
  authMiddleware.protect,
  authValidator.deleteAccountValidator,
  authController.deleteAccount
);

module.exports = router;

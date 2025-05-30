const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");

const router = express.Router();

router.post("/signup", authValidator.signupValidator, authController.signup);

router.get("/verify/:token", authController.verifyEmail);

// router.post("/login", authValidator.loginValidator, authController.login);

router.post(
  "/sendOtp",
  authValidator.sendOtpValidator,
  authController.sendOtpLogin
);

router.post(
  "/verifyOtp",
  authValidator.verifyOtpValidator,
  authController.verifyOtpLogin
);

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
  "/updateName",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user", "admin", "owner"),
  authValidator.updateNameValidator,
  authController.updateName
);

router.patch(
  "/updateProfilePicture",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user", "admin", "owner"),
  authValidator.profilePictureValidator(),
  authController.updateProfilePicture
);

router.patch(
  "/updateMyPassword",
  authMiddleware.protect,
  authValidator.updatePasswordValidator,
  authController.updatePassword
);

router.patch(
  "/deleteAccount",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  authValidator.deleteAccountValidator,
  authController.deleteAccount
);

module.exports = router;

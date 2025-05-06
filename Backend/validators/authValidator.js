const { body } = require("express-validator");
const validate = require("../middlewares/handleValidation");

exports.signupValidator = validate([
  // name validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Name must be between 2 and 50 characters"),

  // Email validation
  body("email").isEmail().withMessage("Please provide a valid email address"),

  // Password validation (min length, and strong password check)
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[0-9]/) // Password must contain at least one number
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/) // Password must contain at least one letter
    .withMessage("Password must contain at least one letter")
    .matches(/[\W_]/) // Password must contain at least one special character
    .withMessage("Password must contain at least one special character"),

  // Confirm password validation
  body("confirmPassword")
    .exists()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password must match");
      }
      return true;
    }),
]);

exports.loginValidator = validate([
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
]);

exports.forgotPasswordValidator = validate([
  body("email").isEmail().withMessage("Please provide a valid email address"),
]);

exports.resetPasswordValidator = validate([
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .exists()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password must match");
      }
      return true;
    }),
]);

exports.updatePasswordValidator = validate([
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/[0-9]/)
    .withMessage("New password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("New password must contain at least one letter")
    .matches(/[\W_]/)
    .withMessage("New password must contain at least one special character")
    .custom((newPassword, { req }) => {
      if (newPassword === req.body.currentPassword) {
        throw new Error(
          "New password must be different from the current password"
        );
      }
      return true;
    }),

  body("confirmNewPassword")
    .exists()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password and confirm password must match");
      }
      return true;
    }),
]);

exports.deleteAccountValidator = validate([
  body("password")
    .notEmpty()
    .withMessage("Password is required to delete account"),
]);

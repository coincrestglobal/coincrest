const { body } = require("express-validator");
const validate = require("../middlewares/handleValidation");

exports.createAdminValidator = validate([
  // name validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .customSanitizer((value) => value.replace(/\s+/g, " ")) // Collapse multiple spaces into one
    .customSanitizer((value) => value.replace(/^\s+|\s+$/g, "")) // Trim again
    .isLength({ min: 2, max: 20 })
    .withMessage("Name must be between 2 and 20 characters")
    .matches(/^[A-Za-z ]+$/)
    .withMessage("Name must contain only letters and spaces")
    .customSanitizer((value) =>
      value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    ),

  // Email validation
  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("ownerPassword")
    .exists({ checkFalsy: true })
    .withMessage("Your password is required"),
]);

exports.deleteAdminValidator = validate([
  body("ownerPassword")
    .exists({ checkFalsy: true })
    .withMessage("Your password is required"),
]);

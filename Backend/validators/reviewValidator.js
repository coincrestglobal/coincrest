const { body } = require("express-validator");
const validate = require("../middlewares/handleValidation");

exports.validateReview = validate([
  body("rating")
    .exists()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5")
    .toFloat() // converts input like "3.5" to number
    .customSanitizer((value) => {
      // Round to nearest 0.5 and return as number
      return Math.round(value * 2) / 2;
    }),

  body("comment")
    .exists()
    .withMessage("Comment is required")
    .isLength({ min: 10 })
    .withMessage("Comment must be at least 10 characters long"),
]);

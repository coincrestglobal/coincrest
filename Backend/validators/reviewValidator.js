const { body } = require("express-validator");
const validate = require("../middlewares/handleValidation");

exports.validateReview = validate([
  body("rating")
    .exists()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .exists()
    .withMessage("Comment is required")
    .isLength({ min: 10 })
    .withMessage("Comment must be at least 10 characters long"),
]);

const { body } = require("express-validator");
const validate = require("../middlewares/handleValidation");

const normalizeSpaces = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().replace(/\s+/g, " ");
};

exports.validateCreateTerms = validate([
  body("condition")
    .customSanitizer(normalizeSpaces)
    .notEmpty()
    .withMessage("Condition is required"),
]);

const { body } = require("express-validator");

const validate = require("../middlewares/handleValidation");

const normalizeSpaces = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().replace(/\s+/g, " "); // replace multiple spaces with single space
};

exports.validateCreateFAQ = validate([
  body("question")
    .customSanitizer(normalizeSpaces)
    .notEmpty()
    .withMessage("Question is required"),

  body("answer")
    .customSanitizer(normalizeSpaces)
    .notEmpty()
    .withMessage("Answer is required"),

  body("type")
    .trim()
    .isIn(["general", "deposit", "payout"])
    .withMessage("Type must be one of: general, deposit, payout"),
]);

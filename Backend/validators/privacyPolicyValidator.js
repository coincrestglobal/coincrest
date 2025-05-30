const { body } = require("express-validator");
const validate = require("../middlewares/handleValidation");

const normalizeSpaces = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().replace(/\s+/g, " ");
};

exports.validateCreatePrivacy = validate([
  body("title")
    .customSanitizer(normalizeSpaces)
    .notEmpty()
    .withMessage("Title is required"),

  body("policy")
    .customSanitizer(normalizeSpaces)
    .notEmpty()
    .withMessage("Policy is required"),
]);

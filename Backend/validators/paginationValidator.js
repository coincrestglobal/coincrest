const { query } = require("express-validator");
const validate = require("../middlewares/handleValidation");

const paginationValidator = validate([
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
]);

module.exports = paginationValidator;

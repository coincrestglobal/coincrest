const { query } = require("express-validator");
const validate = require("../middlewares/handleValidation");

module.exports = validate([
  query("search")
    .optional()
    .isString()
    .isLength({ min: 2 })
    .withMessage("Please enter at least 2 characters to search."),

  query("role")
    .optional()
    .isIn(["user", "admin", "owner"])
    .withMessage('Invalid role. Allowed roles are "user", "admin" and "owner.'),

  query("sort")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort must be either 'asc' or 'desc'"),

  query("status")
    .optional()
    .isIn([
      "pending",
      "processing",
      "completed",
      "failed",
      "active",
      "redeemed",
      "approved",
      "resolved",
      "unresolved",
    ])
    .withMessage("Please select a valid status."),

  query("tokenType")
    .optional()
    .isIn(["TRC-20", "BEP-20"])
    .withMessage("Please select a valid token type."),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Please enter a valid start date."),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Please enter a valid end date."),

  query("endDate").custom((value, { req }) => {
    if (req.query.startDate && value) {
      const start = new Date(req.query.startDate);
      const end = new Date(value);
      if (start > end) {
        throw new Error("End date should be same or after the start date.");
      }
    }
    return true;
  }),
]);

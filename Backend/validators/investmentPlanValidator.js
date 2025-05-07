const { body, check } = require("express-validator");
const validate = require("../middlewares/handleValidation");

exports.validateNewInvestmentPlan = validate([
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("minAmount")
    .isNumeric()
    .withMessage("Minimum amount must be a number")
    .custom((value, { req }) => value > 0)
    .withMessage("Minimum amount must be greater than 0")
    .custom((value, { req }) => value < req.body.maxAmount)
    .withMessage("Minimum amount must be less than maximum amount"),

  body("maxAmount")
    .isNumeric()
    .withMessage("Maximum amount must be a number")
    .custom((value, { req }) => value > req.body.minAmount)
    .withMessage("Maximum amount must be greater than minimum amount"),

  body("interestRate")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Interest rate must be a number between 0 and 100"),
]);

exports.validateUpdateInvestmentPlan = validate([
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("minAmount")
    .optional()
    .isNumeric()
    .withMessage("Minimum amount must be a number"),

  // body("maxAmount")
  //   .optional()
  //   .isNumeric()
  //   .withMessage("Maximum amount must be a number"),

  body("interestRate")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Interest rate must be a number between 0 and 100"),

  // body().custom((body) => {
  //   if (body.minAmount && !body.maxAmount) {
  //     throw new Error(
  //       "Maximum amount is required if minimum amount is provided"
  //     );
  //   }

  //   if (body.minAmount && body.maxAmount && body.minAmount >= body.maxAmount) {
  //     throw new Error("Minimum amount must be less than maximum amount");
  //   }

  //   return true;
  // }),
]);

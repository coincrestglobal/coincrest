const { body, check } = require("express-validator");
const validate = require("../middlewares/handleValidation");
const { MIN_WITHDRAWAL_AMOUNT } = require("../config/constants");

exports.validateVerifyDeposit = validate([
  body("tokenType")
    .notEmpty()
    .withMessage("Token type is required")
    .isIn(["BEP-20"])
    .withMessage("Token type must be BEP20"),

  body("txId").notEmpty().withMessage("Transaction ID is required"),

  body("trxDateTime")
    .exists()
    .withMessage("Date and time is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Date and time must be valid")
    .custom((value) => {
      const timestamp = Number(value);
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error("Date and time must be valid");
      }

      return true;
    }),

  body("password").notEmpty().withMessage("Password is required"),
]);

exports.validateAddWithdrawalAddress = validate([
  body("tokenType")
    .notEmpty()
    .withMessage("Token type is required")
    .isIn(["BEP-20"])
    .withMessage("Token type must be BEP20"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string")
    .custom((value, { req }) => {
      const tokenType = req.body.tokenType;

      if (tokenType === "BEP-20" && !/^0x[a-fA-F0-9]{40}$/.test(value)) {
        throw new Error(
          "Invalid BEP-20 address. It should start with '0x' and be 42 characters long."
        );
      }

      return true;
    }),
]);

exports.withdrawalValidator = validate([
  check("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => {
      if (Number(value) < MIN_WITHDRAWAL_AMOUNT) {
        throw new Error(
          `Minimum withdrawal amount is ${MIN_WITHDRAWAL_AMOUNT}`
        );
      }
      return true;
    }),

  check("tokenType")
    .isIn(["BEP-20"])
    .withMessage("Address type must be BEP-20"),

  check("address").notEmpty().withMessage("Address is required"),

  body("password").notEmpty().withMessage("Password is required"),
]);

exports.validateInvestment = validate([
  body("planId")
    .notEmpty()
    .withMessage("Plan ID is required")
    .isMongoId()
    .withMessage("Invalid plan ID"),

  body("investedAmount")
    .notEmpty()
    .withMessage("Invested amount is required")
    .isNumeric()
    .withMessage("Invested amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be greater than 0"),
]);

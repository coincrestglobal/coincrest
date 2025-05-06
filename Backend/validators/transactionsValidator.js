const { body } = require("express-validator");
const config = require("../config/config");
const validate = require("../middlewares/handleValidation");

const launchDate = config.launchDate;

exports.validateTxIdWithDateRange = validate([
  // txId is required
  body("txId")
    .exists({ checkFalsy: true })
    .withMessage("Transaction ID is required"),

  body("fromTimestamp")
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

      const launchMs = new Date(launchDate).getTime();
      if (isNaN(launchMs)) {
        throw new Error("Internal error: Invalid launch date");
      }

      if (timestamp < launchMs) {
        throw new Error(
          "Start date and time cannot be earlier than launch date"
        );
      }

      return true;
    }),

  // Validate maxTimestamp (optional)
  body("maxTimestamp")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Max date and time must be valid")
    .custom((value) => {
      const timestamp = Number(value);
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error("Max date and time must be valid");
      }

      const launchMs = new Date(launchDate).getTime();
      if (timestamp < launchMs) {
        throw new Error("Max date and time cannot be earlier than launch date");
      }

      if (timestamp > Date.now()) {
        throw new Error("Max date and time cannot be in the future");
      }

      return true;
    }),

  // Final custom check to compare fromTimestamp < maxTimestamp (or fallback value)
  body("fromTimestamp").custom((value, { req }) => {
    const from = Number(value);
    const max = req.body.maxTimestamp
      ? Number(req.body.maxTimestamp)
      : Date.now() - 10_000;

    if (from >= max) {
      throw new Error(
        "Start date and time must be earlier than max date and time"
      );
    }

    return true;
  }),
]);

exports.validateDateRange = validate([
  // Validate fromTimestamp
  body("fromTimestamp")
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

      const launchMs = new Date(launchDate).getTime();
      if (isNaN(launchMs)) {
        throw new Error("Internal error: Invalid launch date");
      }

      if (timestamp < launchMs) {
        throw new Error(
          "Start date and time cannot be earlier than launch date"
        );
      }

      return true;
    }),

  // Validate maxTimestamp (optional)
  body("maxTimestamp")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Max date and time must be valid")
    .custom((value) => {
      const timestamp = Number(value);
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error("Max date and time must be valid");
      }

      const launchMs = new Date(launchDate).getTime();
      if (timestamp < launchMs) {
        throw new Error("Max date and time cannot be earlier than launch date");
      }

      if (timestamp > Date.now()) {
        throw new Error("Max date and time cannot be in the future");
      }

      return true;
    }),

  // Final custom check to compare fromTimestamp < maxTimestamp (or fallback value)
  body("fromTimestamp").custom((value, { req }) => {
    const from = Number(value);
    const max = req.body.maxTimestamp
      ? Number(req.body.maxTimestamp)
      : Date.now() - 10_000;

    if (from >= max) {
      throw new Error(
        "Start date and time must be earlier than max date and time"
      );
    }

    return true;
  }),
]);

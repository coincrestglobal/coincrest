const { body } = require("express-validator");

const validate = require("../middlewares/handleValidation");

exports.validateDepositBonus = validate([
  body("value")
    .exists()
    .withMessage("Value is required")
    .custom((value) => {
      // Allow 0, but reject null, undefined, empty string
      if (value === null || value === undefined || value === "") {
        throw new Error("Value cannot be empty");
      }
      return true;
    })
    .isNumeric()
    .withMessage("Value must be a number"),
]);

const allowedBonusKeys = ["10", "50", "100", "500"];

exports.validateTeamBonus = validate([
  body("bonusKey")
    .notEmpty()
    .withMessage("bonusKey is required")
    .isString()
    .withMessage("bonusKey must be a string")
    .custom((value) => {
      if (!allowedBonusKeys.includes(value)) {
        throw new Error(
          `Invalid bonusKey. Allowed keys are: ${allowedBonusKeys.join(", ")}`
        );
      }
      return true;
    }),

  body("bonusValue")
    .notEmpty()
    .withMessage("bonusValue is required")
    .custom((value) => {
      if (value === null || value === undefined || value === "") {
        throw new Error("bonusValue cannot be empty");
      }
      return true;
    })
    .isNumeric()
    .withMessage("bonusValue must be a number"),
]);

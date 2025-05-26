const { body } = require("express-validator");
const validate = require("../middlewares/handleValidation");

exports.createAnnouncementValidator = validate([
  body("title")
    .customSanitizer((value) => value.replace(/\s+/g, " ").trim())
    .notEmpty()
    .withMessage("Title is required"),

  body("message")
    .customSanitizer((value) => value.replace(/\s+/g, " ").trim())
    .notEmpty()
    .withMessage("Message is required"),

  body("visibleTo")
    .isString()
    .withMessage("Please select whom to send the announcement to")
    .custom((visibleTo, { req }) => {
      const allowedValues = ["user", "admin", "all"];
      if (!allowedValues.includes(visibleTo)) {
        throw new Error("Please select a valid recipient for the announcement");
      }
      return true;
    }),
]);

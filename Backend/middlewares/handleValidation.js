const { validationResult } = require("express-validator");

const validate = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        return res.status(400).json({
          status: "fail",
          message: errorMessages[0],
        });
      }
      next();
    },
  ];
};

module.exports = validate;

const { body } = require("express-validator");

exports.createAnnouncementValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("message").notEmpty().withMessage("Message is required"),
  body("visibleTo")
    .isArray({ min: 1 })
    .withMessage("visibleTo must be a non-empty array")
    .custom((roles, { req }) => {
      const userRole = req.user.role;
      const allowed = ["user", "admin", "all"];

      if (!roles.every((r) => allowed.includes(r))) {
        throw new Error("Invalid role in visibleTo");
      }

      if (userRole === "admin") {
        if (roles.length > 1 || roles[0] !== "user") {
          throw new Error("Admins can only send to users");
        }
      }

      return true;
    }),
];

const express = require("express");

const { createRateLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/authMiddleware");
const paginationValidator = require("../validators/paginationValidator");
const queryParamsValidator = require("../validators/queryParamsValidator");
const feedbackValidator = require("../validators/feedbackValidator");
const feedbackController = require("../controllers/feedbackController");

// Custom limiter for feedback route
const feedbackLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000,
  max: 1,
  message:
    "You’ve already submitted feedback recently. Please wait a few minutes before trying again.",
});

const router = express.Router();

router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  paginationValidator,
  queryParamsValidator,
  feedbackController.getAllFeedbacks
);

router.post(
  "/create",
  feedbackLimiter,
  feedbackValidator.validateCreateFeedback,
  feedbackController.createFeedback
);

router.patch(
  "/reply/:feedbackId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  feedbackValidator.validateReplyToFeedback,
  feedbackController.replyToFeedback
);

module.exports = router;

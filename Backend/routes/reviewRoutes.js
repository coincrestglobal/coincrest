const express = require("express");

const reviewController = require("../controllers/reviewController");
const reviewValidator = require("../validators/reviewValidator");
const authMiddleware = require("../middlewares/authMiddleware");
const paginationValidator = require("../validators/paginationValidator");
const queryParamsValidator = require("../validators/queryParamsValidator");

const router = express.Router();

router.post(
  "/add",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  reviewValidator.validateReview,
  reviewController.addReview
);

router.patch(
  "/edit/:reviewId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user"),
  reviewValidator.validateReview,
  reviewController.editReview
);

router.delete(
  "/delete/:reviewId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("user", "admin", "owner"),
  reviewController.deleteReview
);

router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  paginationValidator,
  queryParamsValidator,
  reviewController.getReviews
);

router.get(
  "/getReviewById/:reviewId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("admin", "owner"),
  reviewController.getReviewById
);

router.patch(
  "/approve/:reviewId",
  authMiddleware.protect,
  authMiddleware.authorizeRoles("owner", "admin"),
  reviewController.approveReview
);

router.get("/recentReviews", reviewController.getRecentReviews);

module.exports = router;

const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.getReviews = catchAsync(async (req, res) => {
  let { page, limit, status, sort, startDate, endDate } = req.query;

  page = parseInt(req.query.page) || 1;
  limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const filter = {};

  if (["approved", "pending"].includes(status)) {
    filter.isApproved = status === "approved";
  }

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const sortOrder = sort === "desc" ? -1 : 1;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("rating createdAt")
      .populate("user", "name email -_id"),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    page,
    results: reviews.length,
    total,
    totalPages: Math.ceil(total / limit),
    data: { reviews },
  });
});

exports.getReviewById = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId)
    .select("rating comment createdAt")
    .populate("user", "name profile email -_id");

  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    status: "success",
    message: "Review fetched successfully",
    data: { review },
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { rating, comment } = req.body;

  const existingReview = await Review.findOne({ user: userId });

  if (existingReview) {
    return next(
      new AppError(
        "You have already submitted a review. You can only edit it.",
        400
      )
    );
  }

  const review = new Review({
    user: userId,
    rating,
    comment,
  });

  await review.save();

  res.status(201).json({
    status: "success",
    message: "Review submitted",
    reviewId: review._id,
  });
});

exports.editReview = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId, user: userId });

  if (!review) {
    return next(new AppError("Review not found or unauthorized", 404));
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  review.isApproved = false; // if approval required after edit

  await review.save();

  res.status(200).json({
    status: "success",
    message: "Review updated successfully.",
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { reviewId } = req.params;

  const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

  if (!review) {
    return next(new AppError("Review not found or unauthorized", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
  });
});

exports.approveReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  if (review.isApproved) {
    return res.status(200).json({
      status: "success",
      message: "Review is already approved",
    });
  }

  review.isApproved = true;
  await review.save();

  res.status(200).json({
    status: "success",
    message: "Review approved successfully",
  });
});

exports.getRecentReviews = catchAsync(async (req, res, next) => {
  let userId = null;
  let hasUserReviewed = false;
  let userReview = null;

  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.jwt;
  let token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : cookieToken;

  // Decode token (if exists)
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      userId = decoded.id;
    } catch (err) {
      // Invalid token — skip
    }
  }

  // Base query params
  const queryOptions = {
    isApproved: true,
  };

  // If user logged in, check if they have a review
  if (userId) {
    userReview = await Review.findOne({
      ...queryOptions,
      user: userId,
    })
      .select("rating comment")
      .populate("user", "name profilePicUrl -_id")
      .lean();

    hasUserReviewed = !!userReview;

    // Exclude user's review from next query
    if (hasUserReviewed) queryOptions.user = { $ne: userId };
  }

  // Fetch remaining reviews (14 or 15 depending)
  const remainingLimit = hasUserReviewed ? 14 : 15;
  const recentReviews = await Review.find(queryOptions)
    .sort({ createdAt: -1 })
    .limit(remainingLimit)
    .select("rating comment")
    .populate("user", "name profilePicUrl -_id")
    .lean();

  // Combine reviews
  const reviews = [...(userReview ? [userReview] : []), ...recentReviews].map(
    (review) => ({
      ...review,
      isCurrentUser:
        userId && review.user?._id?.toString() === userId.toString(),
    })
  );

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      hasUserReviewed,
      reviews,
    },
  });
});

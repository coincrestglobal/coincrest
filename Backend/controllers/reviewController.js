const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const sortOrder = sort === "desc" ? -1 : 1;

  const [reviews, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
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

  review.isApproved = true;
  await review.save();

  res.status(200).json({
    status: "success",
    message: "Review approved successfully",
  });
});

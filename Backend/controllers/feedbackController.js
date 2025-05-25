const config = require("../config/config");
const Feedback = require("../models/feedbackModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");

exports.createFeedback = catchAsync(async (req, res) => {
  const { name, email, subject, message } = req.body;

  await Feedback.create({
    name: name,
    email,
    subject,
    message,
  });

  res.status(201).json({
    status: "success",
    message:
      "Thank you for your feedback. Please wait for a response on the email you provided.",
  });
});

exports.replyToFeedback = catchAsync(async (req, res, next) => {
  const { feedbackId } = req.params;
  const { message } = req.body;

  if (!message) {
    return next(new AppError("Reply message is required", 400));
  }

  const feedback = await Feedback.findById(feedbackId);

  if (!feedback) {
    return next(new AppError("Feedback not found", 404));
  }

  if (feedback.isResolved) {
    return res.status(400).json({
      status: "fail",
      message: "This feedback has already been marked as resolved.",
    });
  }

  const fullMessage = `
  Thank you for reaching out to us.
  Below is our response to your feedback:
  ${message}
  If you have any further questions, feel free to reply to this email.
  `;

  await sendEmail({
    email: feedback.email,
    subject: `Response to your feedback: ${feedback.subject}`,
    greeting: feedback?.name
      ? `Hello ${feedback.name.trim().split(" ")[0]}`
      : "",
    message: fullMessage,
    heading: "Response to Your Feedback",
    buttonText: "Contact Support",
    buttonUrl: `mailto:${config.supportEmail}?subject=Follow-up on Feedback`,
  });

  feedback.isResolved = true;
  await feedback.save();

  res.status(200).json({
    status: "success",
    message: "Reply sent and feedback marked as resolved",
  });
});

exports.getAllFeedbacks = catchAsync(async (req, res) => {
  let { page, limit, status, startDate, endDate } = req.query;

  page = parseInt(req.query.page) || 1;
  limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (status === "resolved") filter.isResolved = true;
  if (status === "unresolved") filter.isResolved = false;

  if (startDate && endDate) {
    const start = new Date(startDate).setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate).setUTCHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  const sortOrder = req.query.sort === "desc" ? -1 : 1;

  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("name email subject message createdAt isResolved"),
    Feedback.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    page,
    results: feedbacks.length,
    total,
    totalPages: Math.ceil(total / limit),
    data: {
      feedbacks,
    },
  });
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const managementRoutes = require("./routes/managementRoutes");
const investmentPlanRoutes = require("./routes/investmentPlanRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const settingRoutes = require("./routes/settingRoutes");
const walletRoutes = require("./routes/walletRoutes");
const announcementRoutes = require("./routes//announcementRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(
  "/uploads/profilePics",
  express.static(path.join(__dirname, "uploads/profilePics"))
);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Backend is live and running!");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/management", managementRoutes);
app.use("/api/v1/plans", investmentPlanRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/setting", settingRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/announcement", announcementRoutes);

app.use(errorHandler);

module.exports = app;

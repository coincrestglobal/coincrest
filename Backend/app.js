const express = require("express");
const morgan = require("morgan");
const app = express();
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const managementRoutes = require("./routes/managementRoutes");
const investmentPlanRoutes = require("./routes/investmentPlanRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/management", managementRoutes);
app.use("/api/v1/plans", investmentPlanRoutes);

app.use(errorHandler);

module.exports = app;

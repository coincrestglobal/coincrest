const mongoose = require("mongoose");
const config = require("./config/config");
const connectDB = require("./config/database");
const app = require("./app");
const logger = require("./logger");

const depositScanner = require("./jobs/depositScanner");
const investmentInterestProcessor = require("./jobs/processInvestmentInterest");
const teamBonusScanner = require("./jobs/teamBonusScanner");

let server;

// Handle uncaught exceptions (sync errors)
process.on("uncaughtException", (err) => {
  logger.error(
    { message: err.message, stack: err.stack },
    "Uncaught Exception! Shutting down..."
  );
  // Give time to flush logs before exit
  setTimeout(() => process.exit(1), 1000);
});

// Graceful shutdown function
const shutdown = async () => {
  logger.info("🛑 Shutdown initiated");

  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed");

      await Promise.all([
        depositScanner.stop(),
        investmentInterestProcessor.stop(),
        teamBonusScanner.stop(),
      ]);
      logger.info("All background services stopped.");

      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close(false, () => {
          logger.info("MongoDB connection closed");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });

    // Force exit if not closed in 10 seconds
    setTimeout(() => {
      logger.error("Forcefully shutting down");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(config.port, "0.0.0.0", () => {
      logger.info(`Server running on ${config.serverUrl}`);
    });

    // Start background jobs
    depositScanner.start();
    investmentInterestProcessor.start();
    teamBonusScanner.start();

    // Handle unhandled promise rejections (async errors)
    process.on("unhandledRejection", async (reason, promise) => {
      logger.error(
        {
          message: reason instanceof Error ? reason.message : reason,
          stack: reason instanceof Error ? reason.stack : undefined,
        },
        "Unhandled Rejection at"
      );
      logger.info("Shutting down server due to unhandled promise rejection");
      await shutdown();
    });

    // Listen for termination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error(
      { message: error.message, stack: error.stack },
      "Failed to connect to server"
    );
    // Give logger time to flush before exit
    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.exit(1);
  }
};

startServer();

const config = require("./config/config");
const connectDB = require("./config/database");
const app = require("./app");

// Connect to Database and then start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server running on ${config.serverUrl}`);
    });

    // Start background jobs after server starts
    require("./jobs/depositScanner");
    require("./jobs/processInvestmentInterest");
  } catch (error) {
    console.error("Failed to connect to server:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();

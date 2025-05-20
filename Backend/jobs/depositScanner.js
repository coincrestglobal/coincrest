const cron = require("node-cron");
const { scanTrc20Deposits } = require("../services/trc20DepositService");

let isRunning = false;

// STEP 1: Immediately run on server start
(async () => {
  console.log("Running immediate transaction scan...");
  isRunning = true; // ✅ Start running
  try {
    await scanTrc20Deposits();
  } catch (error) {
    console.log("Error running immediate transaction scan:", error);
  } finally {
    isRunning = false; // ✅ Release after done
    console.log("Immediate transaction scan completed.");
  }
})();

// STEP 2: Schedule to run every 5 minutes using node-cron
cron.schedule("*/5 * * * *", async () => {
  if (isRunning) {
    console.log("Previous job is still running, skipping this run.");
    isRunning = false;
    return;
  }

  console.log("Running scheduled transaction scan...");
  isRunning = true;

  try {
    await scanTrc20Deposits();
  } catch (error) {
    console.log("Error running scheduled transaction scan:", error);
  } finally {
    isRunning = false;
    console.log("Scheduled transaction scan completed.");
  }
});

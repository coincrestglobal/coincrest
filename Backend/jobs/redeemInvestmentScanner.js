const cron = require("node-cron");

const logger = require("../logger");
const {
  scanAndAutoApproveInvestments,
} = require("../services/approveInvestmentService");

let isRunning = false;
let task = null;

const start = () => {
  if (!task) {
    task = cron.schedule("0 0 * * *", async () => {
      if (isRunning) return;
      isRunning = true;
      try {
        await scanAndAutoApproveInvestments();
      } catch (err) {
        logger.error("Error in auto approve investments job:", err);
      } finally {
        isRunning = false;
      }
    });
  }
  task.start();
};

const stop = async () => {
  if (task) {
    task.stop();
  }
  while (isRunning) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

module.exports = {
  start,
  stop,
};

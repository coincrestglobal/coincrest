const cron = require("node-cron");

const logger = require("../logger");
const { scanBep20Deposits } = require("../services/bep20DepositService");

let isRunningBep20 = false;

let bep20Task = null;

const start = () => {
  if (!bep20Task) {
    bep20Task = cron.schedule("*/3 * * * *", async () => {
      if (isRunningBep20) return;
      isRunningBep20 = true;
      try {
        await scanBep20Deposits();
      } catch (err) {
        logger.error("Scheduled BEP-20 Error:", err);
      } finally {
        isRunningBep20 = false;
      }
    });
  }

  // Start the tasks
  bep20Task.start();
};

const stop = async () => {
  if (bep20Task) {
    bep20Task.stop();
  }

  // Wait if job is currently running
  while (isRunningBep20) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

module.exports = {
  start,
  stop,
};

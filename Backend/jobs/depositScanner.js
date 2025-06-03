const cron = require("node-cron");

const logger = require("../logger");
const { scanTrc20Deposits } = require("../services/trc20DepositService");
const { scanBep20Deposits } = require("../services/bep20DepositService");

let isRunningTrc20 = false;
let isRunningBep20 = false;

let trc20Task = null;
let bep20Task = null;

const start = () => {
  if (!trc20Task) {
    trc20Task = cron.schedule("*/5 * * * *", async () => {
      if (isRunningTrc20) return;
      isRunningTrc20 = true;
      try {
        await scanTrc20Deposits();
      } catch (err) {
        logger.error("Scheduled TRC-20 Error:", err);
      } finally {
        isRunningTrc20 = false;
      }
    });
  }
  if (!bep20Task) {
    bep20Task = cron.schedule("*/5 * * * *", async () => {
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
  trc20Task.start();
  bep20Task.start();
};

const stop = async () => {
  if (trc20Task) {
    trc20Task.stop();
  }
  if (bep20Task) {
    bep20Task.stop();
  }

  // Wait if any job is currently running
  while (isRunningTrc20 || isRunningBep20) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

module.exports = {
  start,
  stop,
};

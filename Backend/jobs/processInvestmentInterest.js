const cron = require("node-cron");

const logger = require("../logger");
const {
  calculateAndApplyWeeklyInterest,
} = require("../services/investmentInterestService");

let morningTask = null;
let noonTask = null;

let isRunningMorning = false;
let isRunningNoon = false;

const start = () => {
  if (!morningTask) {
    morningTask = cron.schedule("0 0 * * *", async () => {
      if (isRunningMorning) return;
      isRunningMorning = true;
      try {
        await calculateAndApplyWeeklyInterest();
      } catch (err) {
        logger.error("Error in morning interest payout job:", err);
      } finally {
        isRunningMorning = false;
      }
    });
  }

  if (!noonTask) {
    noonTask = cron.schedule("0 12 * * *", async () => {
      if (isRunningNoon) return;
      isRunningNoon = true;
      try {
        await calculateAndApplyWeeklyInterest();
      } catch (err) {
        logger.error("Error in noon interest payout job:", err);
      } finally {
        isRunningNoon = false;
      }
    });
  }

  morningTask.start();
  noonTask.start();
};

const stop = async () => {
  if (morningTask) {
    morningTask.stop();
  }
  if (noonTask) {
    noonTask.stop();
  }

  while (isRunningMorning || isRunningNoon) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

module.exports = {
  start,
  stop,
};

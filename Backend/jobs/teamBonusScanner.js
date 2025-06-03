const cron = require("node-cron");

const logger = require("../logger");
const { runTeamBonusScanner } = require("../services/teamBonusService");

let task = null;
let isRunning = false;

const start = () => {
  if (!task) {
    task = cron.schedule("*/5 * * * *", async () => {
      if (isRunning) return;
      isRunning = true;
      try {
        await runTeamBonusScanner();
      } catch (err) {
        logger.error("Error in team bonus scanner job:", err);
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

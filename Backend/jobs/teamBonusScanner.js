const cron = require("node-cron");
const { runTeamBonusScanner } = require("../services/teamBonusService");

cron.schedule("*/5 * * * *", () => {
  runTeamBonusScanner();
});

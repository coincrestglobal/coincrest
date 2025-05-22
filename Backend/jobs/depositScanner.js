const cron = require("node-cron");
const { scanTrc20Deposits } = require("../services/trc20DepositService");
const { scanBep20Deposits } = require("../services/bep20DepositService");

let isRunningTrc20 = false;
let isRunningBep20 = false;

// Immediate TRC-20 scan
(async () => {
  console.log("Running immediate TRC-20 scan...");
  isRunningTrc20 = true;
  try {
    await scanTrc20Deposits();
  } catch (err) {
    console.log("TRC-20 Error:", err);
  } finally {
    isRunningTrc20 = false;
  }
})();

// Immediate BEP-20 scan
(async () => {
  console.log("Running immediate BEP-20 scan...");
  isRunningBep20 = true;
  try {
    await scanBep20Deposits();
  } catch (err) {
    console.log("BEP-20 Error:", err);
  } finally {
    isRunningBep20 = false;
  }
})();

// Scheduled every 5 min for TRC-20
cron.schedule("*/5 * * * *", async () => {
  if (isRunningTrc20) return console.log("TRC-20 scan already running.");
  isRunningTrc20 = true;
  try {
    await scanTrc20Deposits();
  } catch (err) {
    console.log("Scheduled TRC-20 Error:", err);
  } finally {
    isRunningTrc20 = false;
  }
});

// Scheduled every 5 min for BEP-20
cron.schedule("*/5 * * * *", async () => {
  if (isRunningBep20) return console.log("BEP-20 scan already running.");
  isRunningBep20 = true;
  try {
    await scanBep20Deposits();
  } catch (err) {
    console.log("Scheduled BEP-20 Error:", err);
  } finally {
    isRunningBep20 = false;
  }
});

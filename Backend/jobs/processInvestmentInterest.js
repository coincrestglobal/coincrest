const cron = require("node-cron");
const {
  calculateAndApplyWeeklyInterest,
} = require("../services/investmentInterestService");

cron.schedule("0 0 * * *", async () => {
  try {
    await calculateAndApplyWeeklyInterest();
    console.log("Interest payout job completed");
  } catch (err) {
    console.error("Error in interest payout job:", err);
  }
});

cron.schedule("0 12 * * *", async () => {
  try {
    await calculateAndApplyWeeklyInterest();
    console.log("Interest payout job completed");
  } catch (err) {
    console.error("Error in interest payout job:", err);
  }
});

cron.schedule("*/1 * * * *", async () => {
  try {
    await calculateAndApplyWeeklyInterest();
    console.log("✅ Interest payout job completed");
  } catch (err) {
    console.error("❌ Error in interest payout job:", err);
  }
});

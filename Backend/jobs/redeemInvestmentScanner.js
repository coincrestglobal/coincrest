const cron = require("node-cron");
const {
  scanAndAutoApproveInvestments,
} = require("../services/approveInvestmentService");

// Schedule to run every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily investment scanner at 12:00 AM");
  await scanAndAutoApproveInvestments();
});

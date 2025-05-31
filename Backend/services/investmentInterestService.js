const Decimal = require("decimal.js");
const User = require("../models/userModel");

async function calculateAndApplyWeeklyInterest() {
  const users = await User.find({
    "investments.status": "active",
    role: "user",
    isDeleted: false,
  });

  for (const user of users) {
    let updated = false;

    for (const investment of user.investments) {
      if (investment.status !== "active") continue;

      const weeklyRate = new Decimal(investment.interestRate).dividedBy(100);

      const now = new Date();

      const lastCreditedAt =
        investment.lastInterestCreditedAt || investment.investDate;
      const lastCreditedDate = new Date(lastCreditedAt);

      const fullWeekPassed = Math.floor(
        (now - lastCreditedDate) / (7 * 24 * 60 * 60 * 1000)
      );

      if (fullWeekPassed > 0) {
        const profitToAdd = new Decimal(investment.investedAmount)
          .times(weeklyRate)
          .times(fullWeekPassed)
          .toDecimalPlaces(6);

        investment.profit = new Decimal(investment.profit || 0)
          .plus(profitToAdd)
          .toDecimalPlaces(6)
          .toNumber();

        user.withdrawableBalance = new Decimal(user.withdrawableBalance || 0)
          .plus(profitToAdd)
          .toDecimalPlaces(6)
          .toNumber();

        investment.lastInterestCreditedAt = new Date(
          lastCreditedDate.getTime() + fullWeekPassed * 7 * 24 * 60 * 60 * 1000
        );

        await user.save();
      }
    }
  }
}

module.exports = { calculateAndApplyWeeklyInterest };

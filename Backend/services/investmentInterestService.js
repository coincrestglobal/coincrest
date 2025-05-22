const Decimal = require("decimal.js");
const User = require("../models/userModel");

async function calculateAndApplyWeeklyInterest() {
  const users = await User.find({
    "investments.status": "active",
    role: "user",
  });

  for (const user of users) {
    let updated = false;

    for (const investment of user.investments) {
      if (investment.status !== "active") continue;

      const weeklyRate = new Decimal(investment.interestRate)
        .dividedBy(100)
        .dividedBy(52);
      const now = new Date();

      const lastCreditedAt =
        investment.lastInterestCreditedAt || investment.investDate;
      const lastCreditedDate = new Date(lastCreditedAt);

      const fullWeeksPassed = Math.floor(
        (now - lastCreditedDate) / (7 * 24 * 60 * 60 * 1000)
      );

      if (fullWeeksPassed > 0) {
        const profitToAdd = new Decimal(investment.investedAmount)
          .times(weeklyRate)
          .times(fullWeeksPassed)
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
          lastCreditedDate.getTime() + fullWeeksPassed * 7 * 24 * 60 * 60 * 1000
        );

        updated = true;
      }
    }

    if (updated) {
      await user.save();
      console.log(`Updated user: ${user.email}`);
    }
  }
}

module.exports = { calculateAndApplyWeeklyInterest };

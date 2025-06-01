const User = require("../models/userModel");
const Notification = require("../models/notificationModel"); // assume ye model hai
const Decimal = require("decimal.js");

function daysBetween(date1, date2) {
  const diffTime = Math.abs(date2 - date1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

async function scanAndAutoApproveInvestments() {
  console.log("Investment scan started:", new Date());

  try {
    const users = await User.find({
      "investments.status": "pending",
      "investments.redeemDate": { $exists: true, $ne: null },
      role: "user",
      isDeleted: false,
    });

    for (const user of users) {
      let updated = false;
      let totalRedeemedAmount = new Decimal(0);

      for (const investment of user.investments) {
        if (
          investment.status === "pending" &&
          investment.redeemDate &&
          !investment.isManuallyApproved
        ) {
          const daysPassed = daysBetween(investment.redeemDate, new Date());

          if (daysPassed >= 15) {
            investment.status = "redeemed";
            totalRedeemedAmount = totalRedeemedAmount.plus(
              investment.investedAmount
            );
            updated = true;

            // Create notification for this redemption
            await Notification.create({
              user: user._id,
              title: "Investment Redeemed",
              message: `Your investment of $${new Decimal(
                investment.investedAmount
              ).toFixed(
                2
              )} has been auto-approved and redeemed. The amount is now available in your withdrawable balance.`,
            });

            console.log(
              `Auto-approved investment ${investment._id} for user ${user._id}`
            );
          }
        }
      }

      if (updated) {
        user.withdrawableBalance = new Decimal(user.withdrawableBalance || 0)
          .plus(totalRedeemedAmount)
          .toDecimalPlaces(6)
          .toNumber();

        await user.save();
      }
    }

    console.log("Investment scan completed.");
  } catch (err) {
    console.error("Error during investment scan:", err);
  }
}

module.exports = { scanAndAutoApproveInvestments };

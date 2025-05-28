const Decimal = require("decimal.js");
const User = require("../models/userModel");
const Setting = require("../models/settingModel");
const { MIN_VALID_REFERRAL_DEPOSIT } = require("../config/constants");

async function runTeamBonusScanner() {
  try {
    console.log("🚀 Running team bonus scanner...");

    // 1. Get team bonus thresholds from settings
    const setting = await Setting.findOne({ key: "team_bonus" });
    if (!setting || !setting.value) return;

    const thresholds = setting.value;

    // 2. Find all eligible referrers (only users, not deleted)
    const referrers = await User.find({
      referralCode: { $ne: null },
      role: "user",
      isDeleted: false,
    });

    for (const referrer of referrers) {
      // 3. Find all referred users with deposits > $100
      const referredUsers = await User.find({
        referredBy: referrer.referralCode,
        role: "user",
        isDeleted: false,
      }).populate({
        path: "deposits",
        match: { amount: { $gt: MIN_VALID_REFERRAL_DEPOSIT } },
        select: "amount",
      });

      const qualifiedReferrals = referredUsers.filter(
        (user) => user.deposits.length > 0
      );

      const referredCount = qualifiedReferrals.length;

      // 4. Check all thresholds
      for (const [threshold, bonusAmount] of Object.entries(thresholds)) {
        const milestoneNumber = parseInt(threshold);

        if (referredCount >= milestoneNumber) {
          const alreadyGiven = referrer.referralBonuses.some(
            (bonus) =>
              bonus.type === "team" && bonus.milestone === milestoneNumber
          );

          if (!alreadyGiven) {
            console.log(
              `💰 Giving ₹${bonusAmount} to ${referrer.email} for ${milestoneNumber} valid referrals.`
            );

            referrer.referralBonuses.push({
              type: "team",
              milestone: milestoneNumber,
              amount: bonusAmount,
              fromUser: referrer._id,
            });

            const currentBalance = new Decimal(
              referrer.withdrawableBalance || 0
            );
            const bonus = new Decimal(bonusAmount);
            referrer.withdrawableBalance = currentBalance
              .plus(bonus)
              .toNumber();

            await referrer.save();
          }
        }
      }
    }

    console.log("✅ Team bonus scanner finished.");
  } catch (err) {
    console.error("❌ Error in scanner:", err);
  }
}

module.exports = {
  runTeamBonusScanner,
};

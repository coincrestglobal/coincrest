const MIN_WITHDRAWAL_AMOUNT = 30;

// Minimum number of days between two withdrawals (if applicable elsewhere)
const MIN_WITHDRAWAL_INTERVAL_DAYS = 7;

// Minimum number of days required between investment and redemption
const MIN_REDEMPTION_INTERVAL_DAYS = 7;

// 💰 Minimum deposit amount required to qualify as "valid referral"
const MIN_VALID_REFERRAL_DEPOSIT = 100;

module.exports = {
  MIN_WITHDRAWAL_AMOUNT,
  MIN_WITHDRAWAL_INTERVAL_DAYS,
  MIN_REDEMPTION_INTERVAL_DAYS,
  MIN_VALID_REFERRAL_DEPOSIT,
};

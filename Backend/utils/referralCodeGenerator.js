const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase62(num) {
  let str = "";
  while (num > 0n) {
    str = BASE62[num % 62n] + str;
    num = num / 62n;
  }
  return str || "0";
}

/**
 * Generates an 8-character unique referral code.
 * Combines current timestamp (ms) with 3 bytes of randomness,
 * encodes result in base62, then pads/trims to 8 chars.
 *
 * @returns {string} 8-character referral code (A-Z, a-z, 0-9)
 */
function generateReferralCode() {
  const timestamp = BigInt(Date.now());
  const randomPart = BigInt(Math.floor(Math.random() * 16777216)); // 3 bytes randomness (0 to 2^24-1)

  // Shift timestamp by 24 bits (3 bytes) and add randomness
  const combined = (timestamp << 24n) + randomPart;

  let code = toBase62(combined);

  // Ensure code length is exactly 8 chars
  if (code.length > 8) {
    code = code.slice(-8); // take last 8 chars if longer
  } else {
    code = code.padStart(8, "0"); // pad with leading zeros if shorter
  }

  return code;
}

module.exports = generateReferralCode;

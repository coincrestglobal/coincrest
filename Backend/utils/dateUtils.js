/**
 * Checks if the required number of days have passed since a given date.
 * @param {Date} lastDate - The previous date (e.g., last withdrawal date).
 * @param {number} minDays - Minimum number of days required to pass.
 * @returns {{ allowed: boolean, daysLeft: number }}
 */
function checkDaysPassed(lastDate, minDays) {
  const now = new Date();
  const last = new Date(lastDate);

  const msDiff = now - last;
  const daysPassed = msDiff / (1000 * 60 * 60 * 24);

  if (daysPassed >= minDays) {
    return { allowed: true, daysLeft: 0 };
  } else {
    const daysLeft = Math.ceil(minDays - daysPassed);
    return { allowed: false, daysLeft };
  }
}

module.exports = { checkDaysPassed };

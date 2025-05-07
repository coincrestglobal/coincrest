/**
 * Checks if 'x' days have passed since a given date.
 * @param {Date|string} date - The initial date to compare.
 * @param {number} x - The number of days to check.
 * @returns {boolean} - Returns true if 'x' or more days have passed, otherwise false.
 */
function hasDaysPassed(date, x) {
  const investDate = new Date(date); // Ensure the input is treated as a date object
  const currentDate = new Date();
  const timeDifference = currentDate - investDate; // Time difference in milliseconds
  const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days

  return daysDifference >= x; // Return true if the days difference is >= 'x'
}

module.exports = { hasDaysPassed };

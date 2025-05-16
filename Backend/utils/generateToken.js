const crypto = require("crypto");

const generateToken = (expiresInMinutes = 15) => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiresIn = Date.now() + expiresInMinutes * 60 * 1000;
  return { token, tokenExpiresIn };
};

module.exports = generateToken;

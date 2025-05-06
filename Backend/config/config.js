require("dotenv").config();

module.exports = {
  // App config
  companyName: process.env.COMPANY_NAME,
  frontendUrl: process.env.FRONTEND_URL,
  serverUrl: process.env.SERVER_URL,
  launchDate: process.env.PRODUCTION_LAUNCH_DATE,
  port: process.env.PORT || 5000,

  // Database configuration
  mongoURI: process.env.MONGODB_URI,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  // Wallet / Blockchain configuration
  tronWalletAddress: process.env.TRON_WALLET_ADDRESS,
  trc20ContractAddress: process.env.TRC20_CONTRACT_ADDRESS,
  tronNodeUrl: process.env.TRON_NODE_URL,
  tronApiKey: process.env.TRON_API_KEY,
  tronWalletPrivateKey: process.env.TRON_WALLET_PRIVATE_KEY,

  // JWT / Auth configuration
  jwtSecret: process.env.JWT_SECRET,
  jwtTokenExpiresIn: process.env.JWT_EXPIRES_IN || 3600, // in seconds

  // Email service configuration
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  supportEmail: process.env.EMAIL_SUPPORT_EMAIL,
};

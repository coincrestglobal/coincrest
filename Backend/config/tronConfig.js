const config = require("./config");
const { TronWeb } = require("tronweb");

const tronWeb = new TronWeb({
  fullHost: config.tronNodeUrl,
  headers: { "TRON-PRO-API-KEY": config.tronApiKey },
  privateKey: config.tronWalletPrivateKey,
});

module.exports = tronWeb;

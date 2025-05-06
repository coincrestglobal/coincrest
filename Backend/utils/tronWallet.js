const { TronWeb } = require("tronweb");

function generateTronWallet() {
  const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
  });

  const account = tronWeb.utils.accounts.generateAccount();
  return {
    address: account.address.base58,
    privateKey: account.privateKey,
  };
}

module.exports = { generateTronWallet };

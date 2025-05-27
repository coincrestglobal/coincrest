const config = require("../config/config");

exports.getDepositAddress = (req, res) => {
  const addresses = {
    "TRC-20": {
      tokenType: "TRC-20",
      walletAddress: config.tronWalletAddress,
    },
    "BEP-20": {
      tokenType: "BEP-20",
      walletAddress: config.bscWalletAddress,
    },
  };
  res.json({
    status: "success",
    message: "Deposit addresses fetched successfully",
    data: { addresses },
  });
};

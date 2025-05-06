const tronWeb = require("../config/tronConfig");
const config = require("../config/config");
const User = require("../models/userModal");

// **Balance Functionality**: Get the balance for a specific address (in Sun)
const checkBalance = async (address) => {
  try {
    // Fetch balance in Sun (smallest unit of TRX)
    const balance = await tronWeb.trx.getBalance(address);
    return balance; // Return balance in Sun
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw new Error("Failed to fetch balance");
  }
};

// **Transfer Functionality**: Owner transfers TRX from the server wallet to a user
const transferTrx = async (req, res) => {
  const { receiverAddress, amount } = req.body;

  // Validate the input
  if (!receiverAddress || !amount || isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ error: "Receiver address and a valid amount are required" });
  }

  try {
    // Get the server wallet balance directly
    const balance = await checkBalance(config.tronWalletAddress);

    // Check if there are sufficient funds for the transfer
    if (balance < amount) {
      return res.status(400).json({
        message: "Insufficient funds in the server wallet",
      });
    }

    // Create a transaction to send TRX from server to receiver address
    const ownerWalletAddress = config.tronWalletAddress;

    const tx = await tronWeb.transactionBuilder.sendTrx(
      receiverAddress,
      amount,
      ownerWalletAddress
    );
    const signedTx = await tronWeb.trx.sign(tx);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);

    // Return success response with transaction result
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: "Transfer failed", message: error.message });
  }
};

// **Balance Functionality**: Get the balance of the server wallet (in TRX)
const getBalance = async (req, res) => {
  try {
    // Get the server wallet balance directly
    const balance = await checkBalance(config.tronWalletAddress);
    res.json({
      balance: balance / 1_000_000, // Convert from Sun to TRX
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({
      error: "Failed to fetch balance",
      message: error.message,
    });
  }
};

const getUserWalletBalance = async (req, res) => {
  const { _id: userId } = req?.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ balance: user.balance });
  } catch (err) {
    console.error("Error fetching wallet balance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const userDeposit = async (req, res) => {
  const { transactionHash, amount } = req.body;
  const { _id: userId } = req.user;

  if (!transactionHash || !amount) {
    return res
      .status(400)
      .json({ error: "Transaction hash and amount are required." });
  }

  try {
    // Optional: Check if transaction already exists
    const exists = await Deposit.findOne({ transactionHash });
    if (exists) {
      return res.status(409).json({ error: "Transaction already recorded." });
    }

    console.log({
      userId,
      transactionHash,
      amount,
      status: "confirmed",
    });

    // Save deposit
    // const deposit = new Deposit({
    //   userId,
    //   transactionHash,
    //   amount,
    //   status: "confirmed", // Or 'pending' if you plan to verify on-chain
    // });

    // await deposit.save();

    // Optionally, update user wallet balance here
    // await Wallet.findOneAndUpdate({ userId }, { $inc: { balance: amount } });

    res.json({ success: true, message: "Deposit recorded.", deposit });
  } catch (error) {
    console.error("Error recording deposit:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = {
  transferTrx,
  getBalance,
  getUserWalletBalance,
  userDeposit,
};

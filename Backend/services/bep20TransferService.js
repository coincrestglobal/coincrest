const { Web3 } = require("web3");
const Decimal = require("decimal.js");
const AppError = require("../utils/appError");

const config = require("../config/config");

const web3 = new Web3(config.bscRpcUrl);
const TOKEN_CONTRACT_ADDRESS = config.bep20ContractAddress; // e.g., USDT on BSC
const DECIMALS = 18; // USDT has 18 decimals on BSC usually

let PRIVATE_KEY = config.bscWalletPrivateKey?.trim();

if (!PRIVATE_KEY) {
  throw new Error("Private key is missing from config.");
}

if (!PRIVATE_KEY.startsWith("0x")) {
  PRIVATE_KEY = "0x" + PRIVATE_KEY;
}

const ERC20_ABI = [
  // Basic ERC20 ABI
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
];

async function transferBEP20(recipientAddress, amount) {
  try {
    // if (!web3.utils.isAddress(recipientAddress)) {
    //   throw new AppError("Invalid recipient BSC address.", 400);
    // }

    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);

    const contract = new web3.eth.Contract(ERC20_ABI, TOKEN_CONTRACT_ADDRESS);
    const adjustedAmount = new Decimal(amount)
      .mul(Decimal.pow(10, DECIMALS))
      .toFixed(0);

    const balance = await contract.methods.balanceOf(account.address).call();
    if (new Decimal(balance).lt(adjustedAmount)) {
      throw new AppError("Insufficient BEP20 token balance.", 402);
    }

    const tx = contract.methods.transfer(recipientAddress, adjustedAmount);
    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const txData = {
      from: account.address,
      to: TOKEN_CONTRACT_ADDRESS,
      data: tx.encodeABI(),
      gas,
      gasPrice,
    };

    const receipt = await web3.eth.sendTransaction(txData);

    return {
      success: true,
      txId: receipt.transactionHash,
      senderAddress: account.address,
    };
  } catch (err) {
    console.log(err);
    if (err instanceof AppError) {
      return {
        success: false,
        error: { message: err.message, statusCode: err.statusCode },
      };
    }

    return {
      success: false,
      error: {
        message: "BEP20 transfer failed due to an unexpected error.",
        statusCode: 500,
      },
    };
  }
}

module.exports = { transferBEP20 };

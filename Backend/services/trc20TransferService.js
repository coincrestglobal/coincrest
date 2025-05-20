const config = require("../config/config");
const tronWeb = require("../config/tronConfig");
const Decimal = require("decimal.js");
const AppError = require("../utils/appError");

const USDT_CONTRACT = config.trc20ContractAddress;
const FEE_LIMIT = config.trc20FeeLimit || 100_000_000;

async function transferTRC20(recipientAddress, amount, decimals = 6) {
  try {
    const senderAddress = tronWeb.defaultAddress.base58;

    if (!tronWeb.isAddress(recipientAddress)) {
      throw new AppError("Invalid recipient TRON address.", 400);
    }

    const adjustedAmount = new Decimal(amount)
      .mul(Decimal.pow(10, decimals))
      .toFixed(0);

    const trxBalanceSun = await tronWeb.trx.getBalance(senderAddress);
    const trxBalance = new Decimal(trxBalanceSun).div(1_000_000);

    if (trxBalance.lessThan(1)) {
      throw new AppError(
        "Insufficient TRX balance. At least 1 TRX is required for fees.",
        402
      );
    }

    const contract = await tronWeb.contract().at(USDT_CONTRACT);
    const usdtBalanceRaw = await contract.methods
      .balanceOf(senderAddress)
      .call();

    if (new Decimal(usdtBalanceRaw).lessThan(adjustedAmount)) {
      throw new AppError("Insufficient USDT balance.", 402);
    }

    const resource = await tronWeb.trx.getAccountResources(senderAddress);
    const availableEnergy = resource.EnergyLimit - resource.EnergyUsed;

    if (availableEnergy < 5000 && trxBalance.lessThan(5)) {
      throw new AppError("Low energy and TRX. Top up required.", 402);
    }

    const functionSelector = "transfer(address,uint256)";
    const parameter = [
      { type: "address", value: recipientAddress },
      { type: "uint256", value: adjustedAmount },
    ];

    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      USDT_CONTRACT,
      functionSelector,
      { feeLimit: FEE_LIMIT },
      parameter
    );

    if (!tx.result || !tx.result.result) {
      throw new AppError(
        "Smart contract trigger failed. Check energy or fee.",
        500
      );
    }

    const signedTx = await tronWeb.trx.sign(tx.transaction);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);

    if (result.result !== true) {
      throw new AppError("Transaction broadcast failed.", 500);
    }

    return { success: true, txId: result.txid, senderAddress };
  } catch (err) {
    if (err instanceof AppError) {
      return {
        success: false,
        error: { message: err.message, statusCode: err.statusCode },
      };
    }

    return {
      success: false,
      error: {
        message: "TRC20 transfer failed due to an unexpected error.",
        statusCode: 500,
      },
    };
  }
}

module.exports = { transferTRC20 };

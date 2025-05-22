const axios = require("axios");
const delay = require("../utils/delay");
const config = require("../config/config");
const Deposit = require("../models/depositModel");
const { updateBep20SyncState, getBep20SyncState } = require("./syncStates");
const Decimal = require("decimal.js");

const myWalletAddress = config.bscWalletAddress;
const bep20ContractAddress = config.bep20ContractAddress;
const bscScanApiKey = config.bscScanApiKey;

async function buildBep20Url(fromTimestamp, maxTimestamp) {
  const startBlock = await getBlockByTimestamp(
    Math.floor(fromTimestamp / 1000)
  );
  const endBlock = await getBlockByTimestamp(Math.floor(maxTimestamp / 1000));

  if (!startBlock || !endBlock) return null;

  const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${myWalletAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${bscScanApiKey}`;
  return url;
}

async function getBlockByTimestamp(timestampInSeconds) {
  try {
    const url = `https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=${timestampInSeconds}&closest=before&apikey=${bscScanApiKey}`;

    const { data } = await axios.get(url);

    if (data.status === "1" && !isNaN(parseInt(data.result))) {
      return parseInt(data.result, 10);
    } else {
      return null;
    }
  } catch (error) {
    console.error("[getBlockByTimestamp] Error:", error.message || error);
    throw error;
  }
}

async function fetchBep20Transactions(url, txId = null) {
  const allTransactions = [];

  try {
    const { data } = await axios.get(url);
    const transactions = data?.result || [];

    if (txId) {
      const found = transactions.find((tx) => tx.hash === txId);
      if (found) {
        return [found];
      }
    } else {
      if (transactions.length > 0) {
        allTransactions.push(...transactions);
      }
    }

    await delay(300);
    return allTransactions;
  } catch (error) {
    console.error(
      "[fetchBep20Transactions] Error fetching BEP-20 transactions:",
      error.response?.data || error.message
    );
    return [];
  }
}

function filterBep20Deposits(transactions) {
  const filtered = transactions
    .filter(
      (tx) =>
        tx?.contractAddress.toLowerCase() ===
          bep20ContractAddress.toLowerCase() &&
        tx?.to.toLowerCase() === myWalletAddress.toLowerCase() &&
        tx?.to.toLowerCase() !== tx?.from.toLowerCase()
    )
    .map((tx) => ({
      amount: new Decimal(tx.value)
        .dividedBy(new Decimal(10).pow(tx.tokenDecimal))
        .toDecimalPlaces(6)
        .toNumber(),
      txId: tx.hash,
      fromAddress: tx.from,
      toAddress: tx.to,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000),
      tokenType: "BEP-20",
    }));
  return filtered;
}

async function saveDeposits(transactions, currentTimestamp) {
  try {
    if (!transactions || transactions.length === 0) {
      if (currentTimestamp) {
        await updateBep20SyncState(currentTimestamp);
      }
      return;
    }

    const existing = await Deposit.find({
      txId: { $in: transactions.map((tx) => tx.txId) },
    })
      .select("txId")
      .lean();

    const existingSet = new Set(existing.map((tx) => tx.txId));
    const uniqueDeposits = transactions.filter(
      (tx) => !existingSet.has(tx.txId)
    );

    if (uniqueDeposits.length > 0) {
      await Deposit.insertMany(uniqueDeposits, { ordered: false });
    }

    if (currentTimestamp) {
      await updateBep20SyncState(currentTimestamp);
      console.log(
        `[saveDeposits] Updated BEP_20(lastFetchedAt) to ${new Date(
          currentTimestamp
        ).toLocaleString()}`
      );
    }
  } catch (error) {
    console.error("Error in saveDeposits(TRC-20):", error);
  }
}

async function scanBep20Deposits() {
  try {
    let lastFetchedAt = await getBep20SyncState();

    lastFetchedAt = lastFetchedAt
      ? new Date(lastFetchedAt).getTime()
      : new Date(config.launchDate).getTime();

    if (!lastFetchedAt) return;

    const fromTimestamp = lastFetchedAt;
    const maxTimestamp = Date.now() - 60 * 1000;

    const url = buildBep20Url(fromTimestamp, maxTimestamp);

    if (!url) return;

    const transactions = await fetchBep20Transactions(url);
    const deposits = filterBep20Deposits(transactions);

    await saveDeposits(deposits, maxTimestamp);
  } catch (error) {
    console.log("[scanBep20Deposits] Error:", error);
  }
}

module.exports = {
  buildBep20Url,
  fetchBep20Transactions,
  filterBep20Deposits,
  saveDeposits,
  scanBep20Deposits,
};

const axios = require("axios");
const delay = require("../utils/delay");
const config = require("../config/config");
const Deposit = require("../models/depositModel");
const { getTrc20SyncState, updateTrc20SyncState } = require("./syncStates");
const Decimal = require("decimal.js");

const myWalletAddress = config.tronWalletAddress;
const trc20ContractAddress = config.trc20ContractAddress;

function buildTrc20Url(fromTimestamp, maxTimestamp) {
  const params = new URLSearchParams({
    limit: "200",
    min_timestamp: fromTimestamp.toString(),
    max_timestamp: maxTimestamp.toString(),
  });
  return `${
    config.tronNodeUrl
  }/v1/accounts/${myWalletAddress}/transactions/trc20?${params.toString()}`;
}

async function fetchTrc20Transactions(url, txId = null) {
  const allTransactions = [];

  try {
    while (url) {
      const { data } = await axios.get(url);
      const transactions = data?.data || [];

      if (txId) {
        const found = transactions.find((tx) => tx.transaction_id === txId);
        if (found) {
          return [found];
        }
      } else {
        if (transactions.length > 0) {
          allTransactions.push(...transactions);
        }
      }

      await delay(300);
      url = data?.meta?.links?.next || null;
    }

    return allTransactions;
  } catch (error) {
    console.error(
      "Error fetching transactions:",
      error.response?.data || error.message
    );
    return [];
  }
}

function filterTrc20Deposits(transactions) {
  return transactions
    .filter(
      (tx) =>
        tx.token_info.address.toLowerCase() ===
          trc20ContractAddress.toLowerCase() &&
        tx.to.toLowerCase() === myWalletAddress.toLowerCase() &&
        tx.to.toLowerCase() !== tx.from.toLowerCase()
    )
    .map((tx) => ({
      amount: new Decimal(tx.value)
        .dividedBy(new Decimal(10).pow(tx.token_info.decimals))
        .toNumber(),
      txId: tx.transaction_id,
      fromAddress: tx.from,
      toAddress: tx.to,
      timestamp: new Date(tx.block_timestamp),
      tokenType: "TRC-20",
    }));
}

async function saveDeposits(transactions, currentTimestamp) {
  try {
    if (!transactions || transactions.length === 0) {
      console.log("No new deposits to save (trc20).");
      if (currentTimestamp) {
        await updateTrc20SyncState(currentTimestamp);
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
      console.log(`${uniqueDeposits.length} new deposits(TRC-20) saved.`);
    }

    if (currentTimestamp) {
      await updateTrc20SyncState(currentTimestamp);
      console.log(
        `[saveDeposits] Updated TRC_20(lastFetchedAt) to ${new Date(
          currentTimestamp
        ).toLocaleString()}`
      );
    }
  } catch (error) {
    console.error("Error in saveDeposits(TRC-20):", error);
  }
}

async function scanTrc20Deposits() {
  try {
    let lastFetchedAt = await getTrc20SyncState();
    lastFetchedAt = lastFetchedAt
      ? new Date(lastFetchedAt).getTime()
      : new Date(config.launchDate).getTime();

    let fromTimestamp = lastFetchedAt;
    const maxTimestamp = Date.now() - 60 * 1000;
    const step = 3 * 60 * 1000; // 3 minutes per batch

    while (fromTimestamp < maxTimestamp) {
      const fromTs = fromTimestamp;
      const toTs = Math.min(fromTimestamp + step, maxTimestamp);

      const url = buildTrc20Url(fromTs, toTs);

      const transactions = await fetchTrc20Transactions(url);
      const deposits = filterTrc20Deposits(transactions);

      await saveDeposits(deposits, toTs);
      fromTimestamp = toTs;
    }
  } catch (err) {
    console.error("[scanTrc20DepositsByBlock] Error:", err.message);
  }
}

module.exports = {
  buildTrc20Url,
  fetchTrc20Transactions,
  filterTrc20Deposits,
  saveDeposits,
  scanTrc20Deposits,
};

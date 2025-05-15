const axios = require("axios");
const delay = require("../utils/delay");
const config = require("../config/config");
const Deposit = require("../models/depositModel");
const { updateSyncState, getSyncState } = require("./syncStates");
const Decimal = require("decimal.js");

// Static Wallet & Contract Info
const myWalletAddress = "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf";
// const myWalletAddress = config.tronWalletAddress;
// const trc20ContractAddress = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";
const trc20ContractAddress = config.trc20ContractAddress;

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

function buildTrc20Url(fromTimestamp, maxTimestamp) {
  const params = new URLSearchParams({
    limit: "200",
    only_confirmed: "true",
  });

  if (fromTimestamp) params.append("min_timestamp", fromTimestamp.toString());
  if (maxTimestamp) params.append("max_timestamp", maxTimestamp.toString());
  // https://nile.trongrid.io/
  return `https://api.trongrid.io/v1/accounts/${myWalletAddress}/transactions/trc20?${params.toString()}`;
}

async function getAllTrc20Deposits(fromTimestamp, maxTimestamp) {
  try {
    const url = buildTrc20Url(fromTimestamp, maxTimestamp);
    const rawTransactions = await fetchTrc20Transactions(url);

    return filterTrc20Deposits(rawTransactions);
  } catch (error) {
    console.error("Error in getAllTrc20Deposits:", error);
    return [];
  }
}

function filterTrc20Deposits(transactions) {
  return transactions
    .filter(
      (tx) =>
        tx.token_info.address.toLowerCase() ===
          trc20ContractAddress.toLowerCase() &&
        tx.to.toLowerCase() === myWalletAddress.toLowerCase()
    )
    .map((tx) => ({
      amount: new Decimal(tx.value)
        .dividedBy(new Decimal(10).pow(new Decimal(tx.token_info.decimals)))
        .toNumber(),
      txId: tx.transaction_id,
      fromAddress: tx.from,
      toAddress: tx.to,
      timestamp: new Date(tx.block_timestamp),
      tokenType: "TRC-20",
    }));
}

async function saveDeposits(transactions, currentTimestamp) {
  if (!transactions || transactions.length === 0) {
    console.log("No new deposits to save.");
    return false;
  }

  try {
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
      console.log(`${uniqueDeposits.length} new deposits saved.`);
    }

    if (currentTimestamp) {
      await updateSyncState("lastfetch", { lastFetchedAt: currentTimestamp });
    }
  } catch (error) {
    console.error("Error saving deposits:", error.message || error);
  }
}

async function scanTrc20Deposits() {
  try {
    const lastFetchData = await getSyncState("lastfetch");
    const lastFetchedAt = lastFetchData?.lastFetchedAt || config.launchDate;

    if (!lastFetchedAt) return;

    const fromTimestamp = lastFetchedAt;
    const maxTimestamp = Date.now() - 10 * 1000; // 10sec -ve margin

    const deposits = await getAllTrc20Deposits(fromTimestamp, maxTimestamp);

    await saveDeposits(deposits, maxTimestamp);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  buildTrc20Url,
  fetchTrc20Transactions,
  getAllTrc20Deposits,
  filterTrc20Deposits,
  saveDeposits,
  scanTrc20Deposits,
};

const SyncState = require("../models/syncStateModel");

// Common function to update sync state by name
async function updateSyncState(name, timeStamp) {
  try {
    await SyncState.findOneAndUpdate(
      { name },
      { $set: { lastFetchedAt: timeStamp } },
      { upsert: true }
    );
  } catch (err) {
    console.error("Error updating SyncState:", err);
  }
}

// Common function to fetch sync state by name
async function getSyncState(name) {
  try {
    const state = await SyncState.findOne({ name });
    return state ? state.lastFetchedAt : null;
  } catch (err) {
    console.error("Error fetching SyncState:", err);
    return null;
  }
}

// TRC20-specific functions
async function updateTrc20SyncState(timeStamp) {
  return updateSyncState("trc20", timeStamp);
}

async function getTrc20SyncState() {
  return getSyncState("trc20");
}

// BEP20-specific functions
async function updateBep20SyncState(timeStamp) {
  return updateSyncState("bep20", timeStamp);
}

async function getBep20SyncState() {
  return getSyncState("bep20");
}

module.exports = {
  updateTrc20SyncState,
  getTrc20SyncState,
  updateBep20SyncState,
  getBep20SyncState,
};

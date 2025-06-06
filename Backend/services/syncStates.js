const logger = require("../logger");
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
    logger.error("Error updating SyncState:", err);
  }
}

// Common function to fetch sync state by name
async function getSyncState(name) {
  try {
    const state = await SyncState.findOne({ name });
    return state ? state.lastFetchedAt : null;
  } catch (err) {
    logger.error("Error fetching SyncState:", err);
    return null;
  }
}

// BEP20-specific functions
async function updateBep20SyncState(timeStamp) {
  return updateSyncState("bep20", timeStamp);
}

async function getBep20SyncState() {
  return getSyncState("bep20");
}

module.exports = {
  updateBep20SyncState,
  getBep20SyncState,
};

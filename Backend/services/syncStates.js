const SyncState = require("../models/syncStateModel");

// function to update the last fetched timestamp
async function updateSyncState(name, data) {
  try {
    await SyncState.findOneAndUpdate(
      { name },
      { $set: { data } },
      { upsert: true }
    );
    console.log(`SyncState '${name}' updated.`);
  } catch (err) {
    console.error("Error updating SyncState:", err);
  }
}

async function getSyncState(name) {
  try {
    const state = await SyncState.findOne({ name });
    return state ? state.data : null;
  } catch (err) {
    console.error("Error fetching SyncState:", err);
    return null;
  }
}

module.exports = {
  updateSyncState,
  getSyncState,
};

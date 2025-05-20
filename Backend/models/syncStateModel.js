const mongoose = require("mongoose");

const syncStateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    lastFetchedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const SyncState = mongoose.model("SyncState", syncStateSchema);

module.exports = SyncState;

const mongoose = require("mongoose");

const syncStateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    data: { type: Object, default: {} },
  },
  { timestamps: true }
);

const SyncState = mongoose.model("SyncState", syncStateSchema);

module.exports = SyncState;

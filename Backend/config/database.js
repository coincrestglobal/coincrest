const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  const uri = config.mongoURI
    .replace("<admin>", config.dbUser)
    .replace("<password>", config.dbPassword);
  try {
    await mongoose.connect(uri, {
      dbName: config.dbName,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

module.exports = connectDB;

// // let trxDateTime = new Date("2025-05-06 06:23:42Z");
// let trxDateTime = new Date();

// console.log(trxDateTime.getTimezoneOffset());

// // const fromTimestamp = trxDateTime - 1 * 60 * 1000,
// //   maxTimestamp = trxDateTime + 5 * 60 * 1000;

// // console.log(
// //   new Date(fromTimestamp),
// //   new Date(trxDateTime).toLocaleString(),
// //   new Date(maxTimestamp).getTime()
// // );

// const Decimal = require("decimal.js");
// const x = 0.1 + 0.2;
// const y = new Decimal(0.1).plus(0.2).toNumber();
// console.log(x, y);

// const { default: mongoose } = require("mongoose");
// const User = require("./models/userModel");
// const config = require("./config/config");
// const connectDB = require("./config/database");

// const owner = new User({
//   name: "Sudhir Sharma",
//   email: "sudhirsharma123@gmail.com",
//   role: "owner",
//   isVerified: true,
//   password: "password",
// });

// console.log(owner);

// (async function fn() {
//   await connectDB();
//   await owner.save();
// })();

const { transferTRC20 } = require("./services/trc20TransferService");

async function fn() {
  const result = await transferTRC20("TRjwFxxjfSexDtn5KvAktiUP7FnHwBQFUZ", 10);
  console.log(result);
}

fn();

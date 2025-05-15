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

const Decimal = require("decimal.js");
const x = 0.1 + 0.2;
const y = new Decimal(0.1).plus(0.2).toNumber();
console.log(x, y);

const express = require("express");

const walletController = require("../controllers/walletController");

const router = express.Router();

router.get("/getDepositAddresses", walletController.getDepositAddress);

module.exports = router;

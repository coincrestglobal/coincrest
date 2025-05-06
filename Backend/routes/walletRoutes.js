const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const multer = require("../middlewares/upload");

router.post("/transfer", multer.none(), walletController.transferTrx);
router.get("/server-balance", walletController.getBalance);
router.get("/user-balance", walletController.getUserWalletBalance);
router.post("/deposit", walletController.userDeposit);

module.exports = router;

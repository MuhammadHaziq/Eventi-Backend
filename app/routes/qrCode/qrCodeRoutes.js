var express = require("express");
var router = express.Router();
const qrCodeController = require("../../controllers/qrCode/qrCodeController");
const authMiddleware = require("../../middleware/authMiddleware");


router.route("/:cust_id").get(authMiddleware, qrCodeController.getQRCode);


module.exports = {
  router: router,
  basePath: "qrcode",
};
 
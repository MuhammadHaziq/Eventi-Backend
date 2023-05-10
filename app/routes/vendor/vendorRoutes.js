var express = require('express');
var router = express.Router();
const vendorController = require("../../controllers/Vendor/vendorController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(vendorController.addVendor);
router.route("/").get(authMiddleware, vendorController.getVendors);
router.route("/:userId").get(authMiddleware, vendorController.getVendor);
router.route("/:userId").put(authMiddleware, vendorController.updateVendor);
router.route("/:userId").delete(authMiddleware,vendorController.deleteVendor);

module.exports = {
    router:router,
    basePath:"vendor"
}
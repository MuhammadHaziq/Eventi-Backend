var express = require('express');
var router = express.Router();
const vendorController = require("../../controllers/Vendor/vendorController");

router.route("/").post(vendorController.addVendor);
router.route("/").get(vendorController.getVendors);
router.route("/:userId").get(vendorController.getVendor);
router.route("/:userId").put(vendorController.updateVendor);
router.route("/:userId").delete(vendorController.deleteVendor);

module.exports = {
    router:router,
    basePath:"vendor"
}
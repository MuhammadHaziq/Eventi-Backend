var express = require('express');
var router = express.Router();
const vendorController = require("../../controllers/Vendor/vendorController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(vendorController.addVendor);
router.route("/").get(authMiddleware, vendorController.getVendors);
router.route("/:vendorId").get(authMiddleware, vendorController.getVendor);
router.route("/:vendorId").put(authMiddleware, vendorController.updateVendor);
router.route("/:vendorId").delete(authMiddleware,vendorController.deleteVendor);

module.exports = {
    router:router,
    basePath:"vendor"
}
var express = require("express");
var router = express.Router();
const vendorController = require("../../controllers/vendor/vendorController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(vendorController.addVendor);
router.route("/").get(authMiddleware, vendorController.getVendors);
router
  .route("/vendor-drop-down")
  .get(authMiddleware, vendorController.getAllVendors);
router.route("/:account_id").get(authMiddleware, vendorController.getVendor);
router.route("/:account_id").put(authMiddleware, vendorController.updateVendor);
router
  .route("/:account_id")
  .delete(authMiddleware, vendorController.deleteVendor);

module.exports = {
  router: router,
  basePath: "vendor",
};

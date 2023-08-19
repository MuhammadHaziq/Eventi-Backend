var express = require("express");
var router = express.Router();
const mobileAppController = require("../../controllers/mobileApp/mobileAppController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/events/:vendor_id").get(authMiddleware, mobileAppController.getVendorEvents);
router.route("/customer/:event_id/:customer_id").get(authMiddleware, mobileAppController.getCustomer);
router.route("/products/:event_id/:vendor_id").get(authMiddleware, mobileAppController.getVendorEventProducts);

module.exports = {
  router: router,
  basePath: "app",
};
 
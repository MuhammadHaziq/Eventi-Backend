var express = require("express");
var router = express.Router();
const eventController = require("../../controllers/event/eventController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(authMiddleware, eventController.addEvent);
router.route("/").get(authMiddleware, eventController.getEvents);
router.route("/:eventId").get(authMiddleware, eventController.getEvent);
router.route("/:eventId").put(authMiddleware, eventController.updateEvent);
router.route("/:eventId").delete(authMiddleware, eventController.deleteEvent);
router
  .route("/:eventId/:account_id")
  .put(authMiddleware, eventController.customerJoinEvent);
router
  .route("/vendor-event-update/:eventId/:account_id")
  .put(authMiddleware, eventController.vendorJoinEvent);
router
  .route("/update-customer-status/:eventId/:customer_id")
  .put(authMiddleware, eventController.updateCustomerEventStatus);
router
  .route("/approved-customer-status/:eventId/:customer_id")
  .put(authMiddleware, eventController.approvedCustomerEventStatus);
router
  .route("/update-vendor-status/:eventId/:vendor_id")
  .put(authMiddleware, eventController.updateVendorEventStatus);
router
  .route("/approved-vendor-status/:eventId/:vendor_id")
  .put(authMiddleware, eventController.approvedVendorEventStatus);

module.exports = {
  router: router,
  basePath: "event",
};

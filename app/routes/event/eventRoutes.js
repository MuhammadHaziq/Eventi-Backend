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
module.exports = {
  router: router,
  basePath: "event",
};

var express = require('express');
var router = express.Router();
const eventController = require("../../controllers/Event/eventController");

router.route("/").post(eventController.addEvent);
router.route("/").get(eventController.getEvents);
router.route("/:eventId").get(eventController.getEvent);
router.route("/:eventId").put(eventController.updateEvent);
router.route("/:eventId/:userId").delete(eventController.deleteEvent);

module.exports = {
    router:router,
    basePath:"event"
}
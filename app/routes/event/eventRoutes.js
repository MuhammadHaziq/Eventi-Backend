var express = require('express');
var router = express.Router();
const eventController = require("../../controllers/Event/eventController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(authMiddleware,eventController.addEvent);
router.route("/").get(authMiddleware, eventController.getEvents);
router.route("/:eventId").get(authMiddleware, eventController.getEvent);
router.route("/:eventId").put(authMiddleware, eventController.updateEvent);
router.route("/:eventId/:userId").delete(authMiddleware, eventController.deleteEvent);

module.exports = {
    router:router,
    basePath:"event"
}
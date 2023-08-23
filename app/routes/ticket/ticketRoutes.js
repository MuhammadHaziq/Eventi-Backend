var express = require("express");
var router = express.Router();
const ticketController = require("../../controllers/ticket/ticketController");
const authMiddleware = require("../../middleware/authMiddleware");


router.route("/").post(authMiddleware, ticketController.ticketAdd);
router.route("/:custID").get(authMiddleware, ticketController.getTicket);
// router.route("/:eventId").put(authMiddleware, ticketController.updateEvent);
// router.route("/:eventId").delete(authMiddleware, ticketController.deleteEvent);

module.exports = {
  router: router,
  basePath: "ticket",
};

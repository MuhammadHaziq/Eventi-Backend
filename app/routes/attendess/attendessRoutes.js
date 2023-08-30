var express = require("express");
var router = express.Router();
const attendeController = require("../../controllers/attendess/attendeController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(authMiddleware, attendeController.addAttende);
router.route("/").get(authMiddleware, attendeController.getAttendess);
router.route("/:attende_id").get(authMiddleware, attendeController.getAttende);
router
  .route("/:account_id/:event_id")
  .get(authMiddleware, attendeController.getAccountAttendess);

module.exports = {
  router: router,
  basePath: "attende",
};

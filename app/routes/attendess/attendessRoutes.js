var express = require("express");
var router = express.Router();
const attendeController = require("../../controllers/attendess/attendeController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(authMiddleware, attendeController.addAttende);
router.route("/").get(authMiddleware, attendeController.getAttendess);
router.route("/:attende_id").get(authMiddleware, attendeController.getAttende);

module.exports = {
  router: router,
  basePath: "attende",
};

var express = require("express");
var router = express.Router();
const joinedEventController = require("../../controllers/joinedEvent/joinedEventController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(authMiddleware, joinedEventController.addJoinedEvent);
// router.route("/").get(authMiddleware, joinedEventController.getProducts);
router
  .route("/:account_id/:event_id")
  .get(authMiddleware, joinedEventController.getJoinedEvent);
router.route("/").put(authMiddleware, joinedEventController.updateJoinedEvent);
// router
//   .route("/:product_id")
//   .delete(authMiddleware, joinedEventController.deleteProduct);

module.exports = {
  router: router,
  basePath: "join-event",
};

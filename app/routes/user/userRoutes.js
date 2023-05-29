var express = require("express");
var router = express.Router();
const userController = require("../../controllers/User/userController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/login").post(userController.login);
router.route("/").post(userController.addUser);
router.route("/").get(authMiddleware, userController.getUsers);
router.route("/:account_id").get(authMiddleware, userController.getUser);
router.route("/:account_id").put(authMiddleware, userController.updateUser);
router.route("/:account_id").delete(authMiddleware, userController.deleteUser);

module.exports = {
  router: router,
  basePath: "user",
};

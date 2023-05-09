var express = require('express');
var router = express.Router();
const userController = require("../../controllers/User/userController");

router.route("/login").post(userController.login);
router.route("/").post(userController.addUser);
router.route("/").get(userController.getUsers);
router.route("/:userId").get(userController.getUser);
router.route("/:userId").put(userController.updateUser);
router.route("/:userId").delete(userController.deleteUser);

module.exports = {
    router:router,
    basePath:"user"
}
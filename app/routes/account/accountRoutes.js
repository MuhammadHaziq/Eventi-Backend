var express = require("express");
var router = express.Router();
const accountController = require("../../controllers/Account/accountController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/login").post(accountController.login);
router.route("/").post(accountController.addUser);
router.route("/").get(authMiddleware, accountController.getUsers);
router.route("/:account_id").get(authMiddleware, accountController.getUser);
router.route("/:account_id").put(authMiddleware, accountController.updateUser);
router
  .route("/:account_id")
  .delete(authMiddleware, accountController.deleteUser);

module.exports = {
  router: router,
  basePath: "account",
};

var express = require("express");
var router = express.Router();
const adminController = require("../../controllers/admin/adminController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(adminController.addAdmin);
router.route("/").get(authMiddleware, adminController.getAdmins);
router.route("/:account_id").get(authMiddleware, adminController.getAdmin);
router.route("/:account_id").put(authMiddleware, adminController.updateAdmin);
router
  .route("/:account_id")
  .delete(authMiddleware, adminController.deleteAdmin);

module.exports = {
  router: router,
  basePath: "admin",
};

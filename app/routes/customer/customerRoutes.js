var express = require("express");
var router = express.Router();
const customerController = require("../../controllers/Customer/customerController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(customerController.addCustomer);
router.route("/").get(authMiddleware, customerController.getCustomers);
router
  .route("/:customerId")
  .get(authMiddleware, customerController.getCustomer);
router
  .route("/:customerId")
  .put(authMiddleware, customerController.updateCustomer);
router
  .route("/:customerId")
  .delete(authMiddleware, customerController.deleteCustomer);

module.exports = {
  router: router,
  basePath: "customer",
};

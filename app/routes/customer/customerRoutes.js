var express = require('express');
var router = express.Router();
const customerController = require("../../controllers/Customer/customerController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(customerController.addCustomer);
router.route("/").get(authMiddleware, customerController.getCustomers);
router.route("/:userId").get(authMiddleware, customerController.getCustomer);
router.route("/:userId").put(authMiddleware, customerController.updateCustomer);
router.route("/:userId").delete(authMiddleware, customerController.deleteCustomer);

module.exports = {
    router:router,
    basePath:"customer"
}
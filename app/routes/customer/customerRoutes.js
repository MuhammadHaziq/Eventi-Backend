var express = require('express');
var router = express.Router();
const customerController = require("../../controllers/Customer/customerController");

router.route("/").post(customerController.addCustomer);
router.route("/").get(customerController.getCustomers);
router.route("/:userId").get(customerController.getCustomer);
router.route("/:userId").put(customerController.updateCustomer);
router.route("/:userId").delete(customerController.deleteCustomer);

module.exports = {
    router:router,
    basePath:"customer"
}
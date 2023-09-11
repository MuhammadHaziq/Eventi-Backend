var express = require("express");
var router = express.Router();
const dashboardController = require("../../controllers/dashboard/dashboardController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/customer_dashboard/:event_id/:customer_id").get(authMiddleware, dashboardController.getCustomerDashboard);

module.exports = {
  router: router,
  basePath: "dashboard",
};

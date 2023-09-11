const dashboardService = require("../../services/dashboard/dashboardService");

module.exports = {

  getCustomerDashboard: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        user_type: req.user.user_type,
        authAccount: req.account_id
      };
      const response = await dashboardService.getCustomerDashboard(body);
      if (response && Object.keys(response).length > 0)
        return helper.apiResponse(
          res,
          false,
          "Customer Points Summary Successfully",
          response
        );
      return helper.apiResponse(res, true, "No Customer Data Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },


};

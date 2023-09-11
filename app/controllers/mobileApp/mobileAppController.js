const mobileAppService = require("../../services/mobileApp/mobileAppService");

module.exports = {

  getVendorEventProducts: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        user_type: req.user.user_type,
        authAccount: req.account_id
      };
      const response = await mobileAppService.getVendorEventProducts(body);
      console.log(body);
      if (response && response.length > 0)
        return helper.apiResponse(
          res,
          false,
          "Products Fetch Successfully",
          response
        );
      return helper.apiResponse(res, true, "No Products Data Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
  
  getVendorEvents: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        user_type: req.user.user_type,
        authAccount: req.account_id
      };
      const response = await mobileAppService.getVendorEvents(body);
      if (response && response.length > 0)
        return helper.apiResponse(
          res,
          false,
          "Events Fetch Successfully",
          response
        );
      return helper.apiResponse(res, true, "No Event Data Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getCustomer: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        user_type: req.user.user_type,
        authAccount: req.account_id
      };
      const response = await mobileAppService.getCustomer(body);
      if (response && Object.keys(response).length > 0)
        return helper.apiResponse(
          res,
          false,
          "Customer Fetch Successfully",
          response
        );
      return helper.apiResponse(res, true, "No Customer Data Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getCustomerConsumePoints: async (req, res) => {
    try {
      const body = {
        ...req.body,
        user_type: req.user.user_type,
        authAccount: req.account_id
      };
      const response = await mobileAppService.consumeCustomerPoints(body);
      if (response && Object.keys(response).length > 0)
        return helper.apiResponse(
          res,
          false,
          "Customer Points Consumed Fetch Successfully",
          response
        );
      return helper.apiResponse(res, true, "No Customer Data Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

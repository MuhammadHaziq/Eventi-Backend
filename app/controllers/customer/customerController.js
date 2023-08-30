const customerService = require("../../services/customer/customerServices");

module.exports = {
  addCustomer: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params };
      const newCustomer = await customerService.addCustomer(body);
      if (newCustomer)
        return helper.apiResponse(
          res,
          false,
          "Customer Created Successfully",
          newCustomer
        );
      return helper.apiResponse(
        res,
        true,
        "Customer Not Created Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getCustomers: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req.query,
        user_type: req.user.user_type,
        authAccount: req.account_id,
      };
      const customers = await customerService.getCustomers(body);
      if (customers && customers?.data?.length > 0) {
        return helper.apiResponse(
          res,
          false,
          "Customers Fetch Successfully",
          customers
        );
      }
      return helper.apiResponse(res, true, "No Customers Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getCustomer: async (req, res) => {
    try {
      const body = {
        account_id: req.params.account_id,
        user_type: req.user.user_type,
      };
      const customer = await customerService.getCustomer(body);
      if (customer)
        return helper.apiResponse(
          res,
          false,
          "Customer Fetch Successfully",
          customer
        );
      return helper.apiResponse(res, true, "No Customer Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const updatedProduct = await customerService.updateCustomer(body);
      if (updatedProduct)
        return helper.apiResponse(
          res,
          false,
          "Customer Updated Successfully",
          updatedProduct
        );
      return helper.apiResponse(res, true, "No Customer Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const deletedCustomer = await customerService.deleteCustomer(body);
      if (deletedCustomer)
        return helper.apiResponse(
          res,
          false,
          "Customer Deleted Successfully",
          deletedCustomer
        );
      return helper.apiResponse(res, true, "No Customer Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getCustPaymentHistory: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const getCustPayment = await customerService.getCustPaymentHistory(body);
      if (getCustPayment && getCustPayment?.length > 0)
        return helper.apiResponse(
          res,
          false,
          "Customer Payment History Available",
          getCustPayment
        );
      return helper.apiResponse(res, true, "No History Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

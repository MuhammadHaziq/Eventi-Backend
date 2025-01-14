const joinedEventService = require("../../services/joinedEvent/joinedEventService");

module.exports = {
  addJoinedEvent: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const newJoined = await joinedEventService.addVendorJoinedEvent(body);
      if (newJoined)
        return helper.apiResponse(
          res,
          false,
          "Event Join Request Successfully",
          newJoined
        );
      return helper.apiResponse(
        res,
        true,
        "Join Request not Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getJoinedEvent: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const joinedEvent = await joinedEventService.getJoinedEvent(body);
      if (joinedEvent)
        return helper.apiResponse(
          res,
          false,
          "Joined Event Fetch Successfully",
          joinedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "No Joined Event Detail Found",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateJoinedEvent: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const updatedJoinedEvent = await joinedEventService.updateJoinedEvent(
        body
      );
      if (updatedJoinedEvent)
        return helper.apiResponse(
          res,
          false,
          "Joined Event Update Successfully",
          updatedJoinedEvent
        );
      return helper.apiResponse(res, true, "No Joined Event Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  //   deleteProduct: async (req, res) => {
  //     try {
  //       const body = { ...req.body, ...req.params, authAccount: req.account_id };
  //       const deletedProduct = await productService.deleteProduct(body);
  //       if (deletedProduct)
  //         return helper.apiResponse(
  //           res,
  //           false,
  //           "Product Deleted Successfully",
  //           deletedProduct
  //         );
  //       return helper.apiResponse(res, true, "No Product Found", null);
  //     } catch (err) {
  //       const statusCode = err.status || "INTERNAL_SERVER_ERROR";
  //       return helper.apiResponse(res, true, err.message, null, statusCode);
  //     }
  //   },
};

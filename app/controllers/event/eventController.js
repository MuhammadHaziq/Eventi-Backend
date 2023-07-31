const eventService = require("../../services/event/eventServices");

module.exports = {
  addEvent: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const newEvent = await eventService.addEvent(body);
      if (newEvent)
        return helper.apiResponse(
          res,
          false,
          "Event Created Successfully",
          newEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Not Created Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getEvents: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req.query,
        authAccount: req.account_id,
      };
      const events = await eventService.getEvents(body);
      if (events && events?.data?.length > 0)
        return helper.apiResponse(
          res,
          false,
          "Events Fetch Successfully",
          events
        );
      return helper.apiResponse(
        res,
        true,
        "Events Not Fetch Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getEvent: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const event = await eventService.getEvent(body);
      if (event)
        return helper.apiResponse(
          res,
          false,
          "Event Fetch Successfully",
          event
        );
      return helper.apiResponse(
        res,
        true,
        "Event Not Fetch Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateEvent: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const updatedEvent = await eventService.updateEvent(body);
      if (updatedEvent)
        return helper.apiResponse(
          res,
          false,
          "Event Updated Successfully",
          updatedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Not Updated Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const deletedEvent = await eventService.deleteEvent(body);
      if (deletedEvent)
        return helper.apiResponse(
          res,
          false,
          "Event Deleted Successfully",
          deletedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Not Deleted Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  customerJoinEvent: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const updatedEvent = await eventService.customerJoinEvent(body);
      if (updatedEvent)
        return helper.apiResponse(
          res,
          false,
          "Request Approved Successfully",
          updatedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Status Not Updated Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  vendorJoinEvent: async (req, res) => {
    console.log("Req body data .....", req.body);
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const updatedEvent = await eventService.joinEvent(body);
      if (updatedEvent)
        return helper.apiResponse(
          res,
          false,
          "Request Approved Successfully",
          updatedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Status Not Updated Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateCustomerEventStatus: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const updatedEvent = await eventService.updateCustomerStatus(body);
      if (updatedEvent)
        return helper.apiResponse(
          res,
          false,
          "Request Approved Successfully",
          updatedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Status Not Updated Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  approvedCustomerEventStatus: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const updatedEvent = await eventService.approvedCustomerStatus(body);
      if (updatedEvent)
        return helper.apiResponse(
          res,
          false,
          "Request Approved Successfully",
          updatedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Status Not Updated Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateVendorEventStatus: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const updatedEvent = await eventService.updateVendorStatus(body);
      if (updatedEvent)
        return helper.apiResponse(
          res,
          false,
          "Request Approved Successfully",
          updatedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Status Not Updated Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  approvedVendorEventStatus: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
        authAccount: req.account_id,
      };
      const updatedEvent = await eventService.approvedVendorStatus(body);
      if (updatedEvent)
        return helper.apiResponse(
          res,
          false,
          "Request Approved Successfully",
          updatedEvent
        );
      return helper.apiResponse(
        res,
        true,
        "Event Status Not Updated Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

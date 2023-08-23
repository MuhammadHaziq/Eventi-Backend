const ticketService = require("../../services/ticket/ticketServices");

module.exports = {
    ticketAdd: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req,
      //   authAccount: req.account_id,
      };
      const newTicket = await ticketService.ticketAdd(body);
      if (newTicket)
        return helper.apiResponse(
          res,
          false,
          "Ticket Created Successfully",
          newTicket
        );
      return helper.apiResponse(
        res,
        true,
        "Ticket Not Created Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
   },
    getTicket: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req.query,
      };
       const ticket = await ticketService.getTicket(body);
       console.log(ticket);
      if (ticket)
        return helper.apiResponse(
          res,
          false,
          "Ticket Fetch Successfully",
          ticket
        );
      return helper.apiResponse(
        res,
        true,
        "Ticket Not Fetch",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

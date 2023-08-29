const attendeService = require("../../services/attendess/attendeServices");

module.exports = {
  addAttende: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params };
      const newAttende = await attendeService.addAttende(body);
      if (newAttende)
        return helper.apiResponse(
          res,
          false,
          "Attende Created Successfully",
          newAttende
        );
      return helper.apiResponse(
        res,
        true,
        "Attende Not Created Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getAttendess: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const users = await attendeService.getAttendess(body);
      if (users && users?.length > 0)
        return helper.apiResponse(
          res,
          false,
          "Attendess Fetch Successfully",
          users
        );
      return helper.apiResponse(res, true, "Attendess Not Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getAttende: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const user = await attendeService.getAttende(body);
      if (user)
        return helper.apiResponse(
          res,
          false,
          "Attende Fetch Successfully",
          user
        );
      return helper.apiResponse(res, true, "Attende Not Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

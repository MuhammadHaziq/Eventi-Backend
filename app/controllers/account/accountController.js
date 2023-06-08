const accountService = require("../../services/account/accountServices");

module.exports = {
  login: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params };
      const token = await accountService.login(body);
      if (token)
        return helper.apiResponse(res, false, "User Login Successfully", token);
      return helper.apiResponse(res, true, "User Not Login Successfully", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  addUser: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params };
      const newUser = await accountService.addUser(body);
      if (newUser)
        return helper.apiResponse(
          res,
          false,
          "User Created Successfully",
          newUser
        );
      return helper.apiResponse(
        res,
        true,
        "User Not Created Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getUsers: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const users = await accountService.getUsers(body);
      if (users && users?.length > 0)
        return helper.apiResponse(
          res,
          false,
          "Users Fetch Successfully",
          users
        );
      return helper.apiResponse(
        res,
        true,
        "Users Not Fetch Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getUser: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const user = await accountService.getUser(body);
      if (user)
        return helper.apiResponse(res, false, "User Fetch Successfully", user);
      return helper.apiResponse(res, true, "User Not Fetch Successfully", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateUser: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        authAccount: req.account_id,
        user_type: req.user.user_type,
      };
      const updatedProduct = await accountService.updateUser(body);
      if (updatedProduct)
        return helper.apiResponse(
          res,
          false,
          "User Updated Successfully",
          updatedProduct
        );
      return helper.apiResponse(res, true, "User Not Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        account_id: req.account_id,
        user_type: req.user.user_type,
      };
      const deletedUser = await accountService.deleteUser(body);
      if (deletedUser)
        return helper.apiResponse(
          res,
          false,
          "User Deleted Successfully",
          deletedUser
        );
      return helper.apiResponse(res, true, "User Not Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

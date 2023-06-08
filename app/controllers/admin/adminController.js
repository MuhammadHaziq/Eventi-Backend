const adminService = require("../../services/admin/adminService");

module.exports = {
  addAdmin: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params };
      const newAdmin = await adminService.addAdmin(body);
      if (newAdmin)
        return helper.apiResponse(
          res,
          false,
          "Admin Created Successfully",
          newAdmin
        );
      return helper.apiResponse(
        res,
        true,
        "Admin Not Created Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getAdmins: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req.query,
        user_type: req.user.user_type,
        authAccount: req.account_id,
      };
      const admins = await adminService.getAdmins(body);
      if (admins && admins?.data?.length > 0) {
        return helper.apiResponse(
          res,
          false,
          "Admins Fetch Successfully",
          admins
        );
      }
      return helper.apiResponse(res, true, "No Admins Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getAdmin: async (req, res) => {
    try {
      const body = { account_id: req.params.account_id };
      const admin = await adminService.getAdmin(body);
      if (admin)
        return helper.apiResponse(
          res,
          false,
          "Admin Fetch Successfully",
          admin
        );
      return helper.apiResponse(res, true, "No Admin Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateAdmin: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const updatedAdmin = await adminService.updateAdmin(body);
      if (updatedAdmin)
        return helper.apiResponse(
          res,
          false,
          "Admin Updated Successfully",
          updatedAdmin
        );
      return helper.apiResponse(res, true, "No Admin Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const deletedAdmin = await adminService.deleteAdmin(body);
      if (deletedAdmin)
        return helper.apiResponse(
          res,
          false,
          "Admin Deleted Successfully",
          deletedAdmin
        );
      return helper.apiResponse(res, true, "No Admin Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

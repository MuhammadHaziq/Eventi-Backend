const customerService = require("../customer/customerServices");
const vendorService = require("../vendor/vendorServices");
const Attendess = require("../../models/attendess");
const { adminNav, vendorNav, customerNav } = require("../../../utils/_nav");
const adminService = require("../admin/adminService");
const ObjectId = require("mongoose").Types.ObjectId;

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const accountService = {
  addAttende: async (body) => {
    try {
      const addAttende = new Attendess({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone_number: body.phone_number,
        account_id: body.account_id,
        event_id: body.event_id,
      });
      return await addAttende.save();
    } catch (err) {
      error.status = "BAD_REQUEST";
      error.message = err.message;
      throw error;
    }
  },

  getAttendess: async () => {
    const { authAccount } = body;
    return await Attendess.find({
      deleted_by: { $eq: null },
      account_id: authAccount,
    }).lean();
  },

  getAttende: async (body) => {
    const { _id } = body;
    return await Account.findOne({
      _id: new ObjectId(_id),
      deleted_by: { $eq: null },
    }).lean();
  },
};

module.exports = accountService;

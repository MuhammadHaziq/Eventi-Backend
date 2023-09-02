const Attendess = require("../../models/attendess");
const customerService = require("../../services/customer/customerServices");
const accountService = require("../../services/account/accountServices");
const ObjectId = require("mongoose").Types.ObjectId;

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const attendeService = {
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

  getAttendess: async (body) => {
    const { authAccount } = body;
    return await Attendess.find({
      deleted_by: { $eq: null },
      account_id: authAccount,
    }).lean();
  },

  getAttende: async (body) => {
    const { attende_id } = body;
    return await Attendess.findOne({
      _id: new ObjectId(attende_id),
      deleted_by: { $eq: null },
    }).lean();
  },

  getAccountAttende: async (body) => {
    const { event_id, account_id } = body;
    return await Attendess.find({
      event_id: new ObjectId(event_id),
      account_id: new ObjectId(account_id),
      deleted_by: { $eq: null },
    }).lean();
  },

  addAttendeAccount: async (body) => {
    try {
      const checkAttendes = await attendeService.checkAttende(body.email);
      if (!checkAttendes) {
        const addAttende = new Attendess({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          phone_number: body.phone_number,
          account_id: body.account_id,
          event_id: body.event_id,
        });
        const attende = await addAttende.save();
        return await accountService.addAttendeUser({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          phone_number: body.phone_number,
          event_id: body.event_id,
          attende_id: attende?._id,
          user_type: "customer",
          gender: "Other",
          password: "12345678",
        });
      } else {
        return await customerService.getCustomerEmail(body.email);
      }
    } catch (err) {
      error.status = "BAD_REQUEST";
      error.message = err.message;
      throw error;
    }
  },

  checkAttende: async (email) => {
    return await Attendess.findOne({
      email: email,
      deleted_by: { $eq: null },
    }).count();
  },
};

module.exports = attendeService;

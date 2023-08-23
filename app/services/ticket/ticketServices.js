const Ticket = require("../../models/ticket");
const ObjectId = require("mongoose").Types.ObjectId;
const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const ticketService = {
   ticketAdd: async (body) => {
   try {
    const {
      first_name,
      last_name,
      amount,
      email,
      phone_number,
      cust_id,
    } = body;

      const ticketAdd = new Ticket({
         first_name,
         last_name,
         amount,
         email,
         phone_number,
         cust_id
      });
    return await ticketAdd.save();
      
    } catch (err) {
      error.status = "BAD_REQUEST";
      error.message = err?.message;
      error.data = null;
      throw error;
    }
   },
   getTicket: async (body) => {
      const {custID } = body;
      console.log("Cust ID----",custID);
    return await Ticket.find({
      cust_id: custID,
      deleted_at: { $eq: null },
    }).lean();
  },
};


module.exports = ticketService;

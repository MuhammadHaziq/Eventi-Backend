const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true, index: true },
    last_name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true, index: true },
    phone_number: { type: String, trim: true, required: false },
   cust_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    created_by: { type: Schema.Types.ObjectId, ref: "Account", required: false },
    updated_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Ticket", TicketSchema);

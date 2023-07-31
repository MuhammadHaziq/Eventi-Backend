const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    amount: { type: String, required: true, trim: true, required: true },
    currency: { type: String, required: true, trim: true, required: true },
    payment_id: { type: String, required: true, trim: true, required: true },
    account_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);

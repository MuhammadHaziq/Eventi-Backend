const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorJoinedEvents = new Schema(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Events",
      index: true,
    },
    account_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: "Vendors", required: true },
    products: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
        product_name: { type: String, required: true, trim: true },
        product_description: { type: String, trim: true },
        product_quantity: {
          type: Number,
          required: true,
          trim: true,
          default: 0,
        },
        product_rate: {
          type: Number,
          required: true,
          trim: true,
          default: 0,
        },
        product_amount: {
          type: Number,
          required: true,
          trim: true,
          default: 0,
        },
      },
    ],
    created_by: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VendorJoinedEvents", VendorJoinedEvents);

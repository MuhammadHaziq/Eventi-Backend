const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorJoinedEventsSchema = new Schema(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Events",
      index: true,
    },
    account_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    products: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
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

VendorJoinedEventsSchema.virtual("event_detail", {
  ref: "Event",
  localField: "event_id",
  foreignField: "_id",
  justOne: true,
});

VendorJoinedEventsSchema.virtual("product_images", {
  ref: "Product",
  localField: "products.product_id",
  foreignField: "_id",
  justOne: false,
});

VendorJoinedEventsSchema.pre("find", function () {
  this.populate("event_detail");
  this.populate("product_images", "product_images");
});

VendorJoinedEventsSchema.pre("findOne", function () {
  this.populate("event_detail");
  this.populate("product_images", "product_images");
});

module.exports = mongoose.model("VendorJoinedEvents", VendorJoinedEventsSchema);

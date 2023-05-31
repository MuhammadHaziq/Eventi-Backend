const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true, index: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    user_type: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      required: true,
    },
    userRef: {
      type: String,
      required: true,
      enum: ["Customers", "Vendors"],
      default: "Admin",
    },
    phone_number: { type: String, trim: true, required: true },
    deleted_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// When you `populate()` the `author` virtual, Mongoose will find the
// first document in the User model whose `_id` matches this document's
// `authorId` property.
AccountSchema.virtual("user_detail", {
  ref: (doc) => {
    return doc?.userRef;
  },
  localField: "_id",
  foreignField: "account_id",
  justOne: true,
});

AccountSchema.pre("find", function () {
  this.populate("user_detail");
});

AccountSchema.pre("findOne", function () {
  this.populate("user_detail");
});

module.exports = mongoose.model("Account", AccountSchema);

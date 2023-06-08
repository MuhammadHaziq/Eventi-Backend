const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    first_name: { type: String, required: true, trim: true, index: true },
    last_name: { type: String, required: true, trim: true },
    // unique: true
    email: { type: String, required: true, trim: true },
    password: { type: String, trim: true, set: helper.encrypt, required: true },
    business_name: { type: String, required: false, trim: true, default: null },
    address: { type: String, trim: true },
    age_verification: { type: String, trim: true, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    date_of_birth: { type: String, trim: true },
    phone_number: { type: String, trim: true, required: true },
    deleted_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", AdminSchema);

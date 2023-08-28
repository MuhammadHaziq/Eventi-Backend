const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendeSchema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    first_name: { type: String, required: true, trim: true, index: true },
    last_name: { type: String, required: true, trim: true },
    // unique: true
    email: { type: String, required: true, trim: true },
    phone_number: { type: String, trim: true, required: true },
    deleted_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendess", AttendeSchema);

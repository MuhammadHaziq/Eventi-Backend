const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    event_name: { type: String, required: true, trim: true, index: true },
    event_date: { type: String, required: true, default: null },
    event_location: { type: String, required: true, trim: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: "Vender", required: true },
    type_of_event: { type: String, required: true, trim: true },
    expected_attendence: { type: Number, required: true, trim: true, min: 1 },
    phone_number: { type: String, trim: true, required: true },
    equipments: { type: String, trim: true, required: true },
    security: { type: Boolean, required: true, default: false },
    special_request: { type: String, trim: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deleted_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Event", EventSchema);

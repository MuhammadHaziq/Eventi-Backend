const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
    {
        user_id:{type: Schema.Types.ObjectId, ref: 'User'},
        first_name: { type: String, required: true, trim: true, index: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, trim: true },
        address: { type: String, trim: true },
        date_of_birth:{ type: String, trim: true },
        deleted_at:{ type: Date, default: null}
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Customer', CustomerSchema);
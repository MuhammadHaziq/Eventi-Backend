const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
    {
        user_id:{type: Schema.Types.ObjectId, ref: 'User', required:true},
        first_name: { type: String, required: true, trim: true, index: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, trim: true, unique:true },
        business_name: { type: String, required: false, trim: true, default:null },
        address: { type: String, trim: true },
        age_verification: { type: String, trim: true, default:null },
        phone_number: { type: String, trim: true, required:true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required:true },
        date_of_birth:{ type: String, trim: true },
        deleted_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        deleted_at:{ type: Date, default: null}
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Customer', CustomerSchema);
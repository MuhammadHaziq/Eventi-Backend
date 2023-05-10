const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: { type: String, required: true, trim: true, index: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, trim: true, unique:true },
        password: { type: String, trim: true,set: helper.encrypt, required:true },
        user_type: { type: String, enum: ['customer', 'vendor', 'admin'], required:true },
        business_name: { type: String, required: true, trim: true, index: true },
        address: { type: String, trim: true },
        phone_number: { type: String, trim: true, required:true },
        date_of_birth:{ type: String, trim: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required:true },
        age_verification: { type: String, trim: true, default:null },
        deleted_by:{type: Schema.Types.ObjectId, ref: 'User'},
        updated_by:{type: Schema.Types.ObjectId, ref: 'User'},
        deleted_at:{ type: Date, default: null},
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('User', UserSchema);
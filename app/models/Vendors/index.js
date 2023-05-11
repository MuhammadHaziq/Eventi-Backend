const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema(
    {
        user_id:{type: Schema.Types.ObjectId, ref: 'User', required:true},
        email: { type: String, trim: true, required:true, unique:true },
        password: { type: String, trim: true,set: helper.encrypt, required:true },
        business_name: { type: String, required: true, trim: true, index: true },
        address: { type: String, trim: true },
        date_of_birth:{ type: String, trim: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required:true },
        deleted_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        deleted_at:{ type: Date, default: null}
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Vendor', VendorSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: { type: String, required: true, trim: true, index: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, trim: true},
        user_type: { type: String, enum: ['customer', 'vendor', 'admin'], required:true },
        customer_id:{type: Schema.Types.ObjectId, ref: 'Customer', default:null},
        vendor_id:{type: Schema.Types.ObjectId, ref: 'Vendor', default:null},
        phone_number: { type: String, trim: true, required:true },
        customer_deleted:{ type: Boolean, default:false },
        customer_deleted_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        vendor_deleted:{ type: Boolean, default:false },
        vendor_deleted_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
    {
        user_id:{type: Schema.Types.ObjectId, ref: 'User', required:true},
        email: { type: String, trim: true, unique:true },
        password: { type: String, trim: true,set: helper.encrypt, required:true },
        business_name: { type: String, required: false, trim: true, default:null },
        address: { type: String, trim: true },
        age_verification: { type: String, trim: true, default:null },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required:true },
        date_of_birth:{ type: String, trim: true },
        deleted_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        updated_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        deleted_at:{ type: Date, default: null}
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Customer', CustomerSchema);
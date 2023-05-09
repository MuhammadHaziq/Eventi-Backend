const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: { type: String, required: true, trim: true, index: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, trim: true, unique:true },
        password: { type: String, trim: true,set: helper.encrypt, required:true },
        user_type: { type: String, enum: ['customer', 'vendor', 'admin'], required:true },
        deleted_by:{type: Schema.Types.ObjectId, ref: 'User'},
        updated_by:{type: Schema.Types.ObjectId, ref: 'User'},
        deleted_at:{ type: Date, default: null},
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('User', UserSchema);
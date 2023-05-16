const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        product_name: { type: String, required: true, trim: true, index: true },
        product_price: { type: Number, required: true, trim: true },
        product_quantity: { type: Number, required: false, trim: true, default:null },
        created_by:{type: Schema.Types.ObjectId, ref: 'User', required:true},
        updated_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        deleted_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        deleted_at:{ type: Date, default: null}
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Product', ProductSchema);
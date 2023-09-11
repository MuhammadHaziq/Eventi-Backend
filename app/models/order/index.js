const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 
 
 
 


const OrderSchema = new Schema(
  {
    event_id: { type: String, required: true, trim: true, index: true },
    customer_id: { type: String, required: true, trim: true, index: true },
    pointsConsumed: { type: Number, index: true },
    
    items_order: [{
      product_id: { type: String, required: true, default: null },
      quantity: { type: String, required: true, default: null },
      name: { type: String, required: true, trim: true },
      points: { type: String, required: true, trim: true },
      image: { type: String, required: false, trim: true }
    }],
   
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Order", OrderSchema);

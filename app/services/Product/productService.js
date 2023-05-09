const appConfig = require("../../../config/appConfig");
const Product = require("../../models/Products")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

module.exports = {

    addProduct:async (body)=> {
        const {product_name, product_price, product_quantity, user_id} = body;
        const newProduct  = new Product({
            product_name,
            product_price,
            product_quantity,
            created_by:user_id
        });
        return await newProduct.save();
    },

    getProducts:async (body)=> {
        const {user_id} = body;
        return await Product.find({created_by:user_id, deleted_at:null}).sort({ createdAt: -1 }).lean();
        
    },

    getProduct:async (body)=> {
        const {user_id, product_id} = body;
        return await Product.find({_id:product_id, created_by:user_id, deleted_at:null}).lean();
        }, 

    updateProduct:async (body) => {
        const {product_name, product_price, product_quantity, user_id, product_id} = body;
       const updatedProduct =  await Product.findOneAndUpdate({ _id: product_id }, {
            product_name,
            product_price,
            product_quantity,
            updated_by:user_id,
        }, { new: true }).lean();
        return updatedProduct;
    },

    deleteProduct:async (body)=> {
        const {user_id, product_id} = body;
        return await Product.findOneAndUpdate({_id:product_id, deleted_by:user_id, deleted_at:new Date()}).lean();
    }, 

}
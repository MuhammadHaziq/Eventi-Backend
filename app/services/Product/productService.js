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
        const allProducts = await Product.find({created_by:user_id, deleted_at:null});
        return allProducts;
    },

    getProduct:async (body)=> {
        const {user_id, product_id} = body;
        const product = await Product.find({_id:product_id, created_by:user_id, deleted_at:null});
        return product;
    }, 

    updateProduct:async (body) => {
        const {product_name, product_price, product_quantity, user_id, product_id} = body;
       const updatedProduct =  await Product.findOneAndUpdate({ _id: product_id }, {
            product_name,
            product_price,
            product_quantity,
            created_by:user_id,
            updated_by:user_id,
        }, { new: true }).lean();
        return updatedProduct;
    },

    deletedProduct:async (body)=> {
        const {user_id, product_id} = body;
        const product = await Product.findOneAndUpdate({_id:product_id, deleted_by:user_id, deleted_at:new Date()});
        return product;
    }, 

}
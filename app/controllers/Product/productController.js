const productService = require("../../services/Product/productService");

module.exports = {
    addProduct:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const newProduct = await productService.addProduct(body);
            if(newProduct) helper.apiResponse(res, false, "Product Created Successfully", newProduct);
            helper.apiResponse(res, true, "Product Not Created Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getProducts:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const products = await productService.getProducts(body);
            if(products) helper.apiResponse(res, false, "Products Fetch Successfully", products);
            helper.apiResponse(res, true, "Products Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getProduct:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const product = await productService.getProduct(body);
            if(product) helper.apiResponse(res, false, "Product Fetch Successfully", product);
            helper.apiResponse(res, true, "Product Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateProduct:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const updatedProduct = await productService.updateProduct(body);
            if(updatedProduct) helper.apiResponse(res, false, "Product Updated Successfully", updatedProduct);
            helper.apiResponse(res, true, "Product Not Updated Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteProduct:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const deletedProduct = await productService.deleteProduct(body);
            if(deletedProduct) helper.apiResponse(res, false, "Product Deleted Successfully", deletedProduct);
            helper.apiResponse(res, true, "Product Not Deleted Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}
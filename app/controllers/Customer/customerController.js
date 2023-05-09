const customerService = require("../../services/Customer/customerServices");

module.exports = {
    addCustomer:async(req, res)=> {
        try{
            const body = {...req.body, ...req.params};
            const newCustomer = await customerService.addCustomer(body);
            if(newCustomer) return helper.apiResponse(res, false, "Customer Created Successfully", newCustomer);
            return helper.apiResponse(res, true, "Customer Not Created Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getCustomers:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const products = await customerService.getCustomers(body);
            if(products) return helper.apiResponse(res, false, "Customers Fetch Successfully", products);
            return helper.apiResponse(res, true, "Customers Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getCustomer:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const product = await customerService.getCustomer(body);
            if(product) return helper.apiResponse(res, false, "Customer Fetch Successfully", product);
            return helper.apiResponse(res, true, "Customer Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateCustomer:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const updatedProduct = await customerService.updateCustomer(body);
            if(updatedProduct) return helper.apiResponse(res, false, "Customer Updated Successfully", updatedProduct);
            return helper.apiResponse(res, true, "Customer Not Updated Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteCustomer:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const deletedCustomer = await customerService.deleteCustomer(body);
            if(deletedCustomer) return helper.apiResponse(res, false, "Customer Deleted Successfully", deletedCustomer);
            return helper.apiResponse(res, true, "Customer Not Deleted Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}
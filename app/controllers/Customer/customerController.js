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
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const customers = await customerService.getCustomers(body);
            if(customers && customers?.length > 0) return helper.apiResponse(res, false, "Customers Fetch Successfully", customers);
            return helper.apiResponse(res, true, "No Customers Found", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getCustomer:async(req, res) => {
        try{
            const body = {customerId:req.params.customerId};
            const customer = await customerService.getCustomer(body);
            if(customer) return helper.apiResponse(res, false, "Customer Fetch Successfully", customer);
            return helper.apiResponse(res, true, "No Customer Found", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateCustomer:async(req, res) => {
        try{
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const updatedProduct = await customerService.updateCustomer(body);
            if(updatedProduct) return helper.apiResponse(res, false, "Customer Updated Successfully", updatedProduct);
            return helper.apiResponse(res, true, "No Customer Found", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteCustomer:async(req, res) => {
        try{
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const deletedCustomer = await customerService.deleteCustomer(body);
            if(deletedCustomer) return helper.apiResponse(res, false, "Customer Deleted Successfully", deletedCustomer);
            return helper.apiResponse(res, true, "No Customer Found", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}
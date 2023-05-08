const vendorService = require("../../services/Vendor/vendorServices");

module.exports = {
    addVendor:async(req, res)=> {
        try{
            const body = {...req.body, ...req.params};
            const newVendor = await vendorService.addVendor(body);
            if(newVendor) helper.apiResponse(res, false, "Vendor Created Successfully", newVendor);
            helper.apiResponse(res, true, "Vendor Not Created Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getVendors:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const vendors = await vendorService.getVendors(body);
            if(vendors) helper.apiResponse(res, false, "Vendors Fetch Successfully", vendors);
            helper.apiResponse(res, true, "Vendors Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getVendor:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const vendor = await vendorService.getVendor(body);
            if(vendor) helper.apiResponse(res, false, "Vendor Fetch Successfully", vendor);
            helper.apiResponse(res, true, "Vendor Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateVendor:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const updatedVendor = await vendorService.updateVendor(body);
            if(updatedVendor) helper.apiResponse(res, false, "Vednor Updated Successfully", updatedVendor);
            helper.apiResponse(res, true, "Vednor Not Updated Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteVendor:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const deletedVendor = await vendorService.deleteVendor(body);
            if(deletedVendor) helper.apiResponse(res, false, "Vednor Deleted Successfully", deletedVendor);
            helper.apiResponse(res, true, "Vednor Not Deleted Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}
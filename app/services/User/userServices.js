const Vendor = require("../../models/Vendors");
const customerService = require("../Customer/customerServices")
const vendorService = require("../Vendor/vendorServices")
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

module.exports = {
    addUser:async(body)=> {
        const {user_type} = body;
        // const { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender, user_type, password, age_verification} = body;
        if(user_type?.toLowerCase() === "vendor"){
            /** Add Vendor In Vendor Schema*/
            return await  vendorService.addVendor(body)
         } else {
              /** Add Customer In Customer Schema*/
         return await customerService.addCustomer(body)
         }
    },

    getUsers:async()=> {
        return await Vendor.find({deleted_by:null}).sort({createdAt:-1})
    },

    getUser:async(body)=> {
        const {userId} = body;
        return await Vendor.find({user_id:userId, deleted_by:null})
    },

    updateUser:async(body) => {
        const {user_type} = body;
        if(user_type?.toLowerCase() === "vendor"){
            return await vendorService.updateVendor(body)
        }else {
            return await customerService.updateCustomer(body)
        }
    },

    deleteUser:async(body)=> {
        const {user_type} = body;
        if(user_type?.toLowerCase() === "vendor"){
            return await vendorService.updateVendor(body)
        }else {
            return await customerService.updateCustomer(body)
        }
    }
}
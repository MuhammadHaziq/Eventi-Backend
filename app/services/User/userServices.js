const Vendor = require("../../models/Vendors");
const customerService = require("../Customer/customerServices")
const vendorService = require("../Vendor/vendorServices")
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

const select_user = ["first_name", "last_name", "email", "user_type", "business_name", "address", "phone_number", "date_of_birth", "gender", "age_verification", "createdAt", "updatedAt", "updated_by", "deleted_at", "deleted_by"]

module.exports = {
    login:async(body)=> {
        const {email, password} = body;
        const selectedUser = await User.findOne({email:email}).lean();
        if(selectedUser && !selectedUser.deleted_by){
            if(helper.decrypt(selectedUser?.password) === password){               
                const user = {
                    user_id:selectedUser?._id || "",
                    first_name:selectedUser?.first_name || "",
                    last_name:selectedUser?.last_name || "",
                    email:selectedUser?.email || "",
                    business_name:selectedUser?.business_name || "",
                    user_type:selectedUser?.user_type || "",
                    age_verification:selectedUser?.age_verification || "",
                }
                return await helper.jwt.createJWT(null, user);
            }
        
        error.status = 'UNAUTHORIZED';
        error.message = `User unauthorize to access system`;
        throw error

        }
        error.status = 'NOT_FOUND';
        error.message = `User not exist in system`;
        throw error
        
    },

    addUser:async(body)=> {
        const {user_type} = body;
        // const { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender, user_type, password, age_verification} = body;
        if(user_type?.toLowerCase() === "customer"){
            /** Add Customer In Customer Schema*/
         return await customerService.addCustomer(body)
         } else {
            /** Add Vendor In Vendor Schema*/
            return await  vendorService.addVendor(body)  
         }
    },

    getUsers:async()=> {
        return await User.find({deleted_by:null}).select(select_user).sort({createdAt:-1}).lean()
    },

    getUser:async(body)=> {
        const {userId} = body;
        return await User.find({_id:userId, deleted_by:null}).select(select_user).lean()
    },

    updateUser:async(body) => {
        const {user_type} = body;
        if(user_type?.toLowerCase() === "customer"){
            return await customerService.updateCustomer(body)
        }else {
            return await vendorService.updateVendor(body)
        }
    },

    deleteUser:async(body)=> {
        const {user_type} = body;
        if(user_type?.toLowerCase() === "customer"){
            return await customerService.deleteCustomer(body)
        }else {
            return await vendorService.deleteVendor(body)
        }
    }
}
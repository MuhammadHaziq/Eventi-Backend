const Vendor = require("../../models/Vendors");
const customerService = require("../Customer/customerServices")
const vendorService = require("../Vendor/vendorServices")
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

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
        if(user_type?.toLowerCase() === "vendor"){
            /** Add Vendor In Vendor Schema*/
            return await  vendorService.addVendor(body)
         } else {
              /** Add Customer In Customer Schema*/
         return await customerService.addCustomer(body)
         }
    },

    getUsers:async()=> {
        return await User.find({deleted_by:null}).select(["first_name", "last_name", "email", "user_type", "createdAt", "updatedAt", "updated_by", "deleted_at", "deleted_by"]).sort({createdAt:-1}).lean()
    },

    getUser:async(body)=> {
        const {user_id} = body;
        return await User.find({user_id:user_id, deleted_by:null}).select(["first_name", "last_name", "email", "user_type", "createdAt", "updatedAt", "updated_by", "deleted_at", "deleted_by"]).lean()
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
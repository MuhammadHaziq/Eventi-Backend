const Vendor = require("../../models/Vendors");
const customerService = require("../Customer/customerServices")
const vendorService = require("../Vendor/vendorServices")
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

const select_user = ["first_name", "last_name", "email", "user_type", "createdAt", "updatedAt", "updated_by", "deleted_at", "deleted_by"]

module.exports = {
    login:async(body)=> {
        const {email, password, user_type} = body;
        let selectedUser = {}
        if(user_type === "vendor"){
            selectedUser = await User.aggregate([
                {$match:{email:email, user_type:user_type}},
                {$lookup:{
                    from:"vendors",
                    as:"vendors",
                    localField:"vendor_id",
                    foreignField:"_id"
                }},
                {$unwind:{path:"$vendors",preserveNullAndEmptyArrays:true}},
                {$project:{
                    user_id:"$_id",
                    first_name:"$first_name",
                    last_name:"$last_name",
                    email:"$email",
                    user_type:"$user_type",
                    deleted_by:"$deleted_by",
                    password:"$vendors.password",
                    business_name:"$vendors.business_name",
                    date_of_birth:"$vednors.date_of_birth",
                    gender:"$vendors.gender",
                    phone_number:"$phone_number",
                    vendor_id:"$vendor_id"
                }}
            ])
        }else {
            selectedUser = await User.aggregate([
                {$match:{email:email, user_type:user_type}},
                {$lookup:{
                    from:"customers",
                    as:"customers",
                    localField:"customer_id",
                    foreignField:"_id"
                }},
                {$unwind:{path:"$customers",preserveNullAndEmptyArrays:true}},
                {$project:{
                    user_id:"$_id",
                    first_name:"$first_name",
                    last_name:"$last_name",
                    email:"$email",
                    user_type:"$user_type",
                    deleted_by:"$deleted_by",
                    password:"$customers.password",
                    business_name:"$customers.business_name",
                    date_of_birth:"$customers.date_of_birth",
                    gender:"$customers.gender",
                    phone_number:"$phone_number",
                    customer_id:"$customer_id"
                }}
            ])
        }

        selectedUser = selectedUser?.[0] || "";
        if(selectedUser && !selectedUser.deleted_by){
            if(helper.decrypt(selectedUser?.password) === password){   
                delete selectedUser?.password;            
                const user = { ...selectedUser};
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
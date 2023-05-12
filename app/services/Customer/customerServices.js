const Customer = require("../../models/Customers");
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

const select = ["first_name", "last_name", "email", "business_name", "address", "age_verification", "gender", "date_of_birth", "phone_number", "deleted_by", "updated_by", "deleted_at", "createdAt", "updatedAt"];

const customerService = {
    addCustomer:async(body)=> {
        try{
            const {first_name, last_name, business_name, email, address, age_verification, phone_number, gender, date_of_birth, user_type, password} = body;
            /** Add Customer In Customer Schema*/
            const addCustomer = new Customer({
                first_name:first_name,
                last_name:last_name,
                email:email,
                password:password,
                user_type:user_type || "customer",
                business_name:business_name, 
                address:address, 
                age_verification:age_verification, 
                phone_number:phone_number, 
                gender:gender, 
                date_of_birth:date_of_birth
            });
            await addCustomer.save()
            return await User.findOne({email:email}).lean(); 
        }catch(err){
            error.status = 'VALIDATION_ERR';
            error.message = `Customer Not Created (${err?.keyValue ? Object.values(err?.keyValue):err.message}) ${err?.code === 11000 ? "Already Exist" : ""}`;
            throw error
        }
     
    },

    getCustomers:async()=> {
        return await Customer.find({deleted_by:null}).select(select).sort({createdAt:-1}).lean()
    },

    getCustomer:async(body)=> {
        const {customerId} = body;
        return await Customer.findOne({_id:customerId, deleted_by:null}).select(select).lean()
    },

    updateCustomer:async(body) => {
        const {customerId, first_name, last_name, business_name, address, age_verification, phone_number, gender, date_of_birth, user_id} = body;
        const exist = await customerService.getCustomer({customerId})
        if(exist){
            return await Customer.findOneAndUpdate({_id:customerId, deleted_at:null},{
                first_name, last_name, business_name, address, age_verification, phone_number, gender, date_of_birth, updated_by:user_id
                },{new:true}).lean();
        }
        return false;
    },

    deleteCustomer:async(body)=> {
        const {user_id, customerId} = body;
        const exist = await customerService.getCustomer({customerId})
        if(exist){
         return await Customer.findOneAndUpdate({_id:customerId, deleted_at:null}, {deleted_by:user_id, deleted_at:new Date()}, {new:true}).lean();
        }
        return false
    }


}
module.exports = customerService
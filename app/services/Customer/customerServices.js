const Customer = require("../../models/Customers");
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

module.exports = {
    addCustomer:async(body)=> {
        const {first_name, last_name, business_name, email, address, age_verification, phone_number, gender, date_of_birth, user_type, password} = body;
        /** Add Customer In User Schema*/
        const addUser = new User({
            first_name:first_name,
            last_name:last_name,
            email:email,
            password:password,
            user_type:user_type || "customer"
        });
       await addUser.save().then(async newUser=> {
            /** Add Customer In Customer Schema*/
            const addCustomer = new Customer({
                user_id:newUser._id, first_name, last_name, business_name, email, address, age_verification, phone_number, gender, date_of_birth
            })
            return await addCustomer.save()
          }).catch(err=> {
                error.status = 'VALIDATION_ERR';
                error.message = `User Not Created (${err.message})`;
                throw error
          });
    },

    getCustomers:async()=> {
        return await Customer.find({deleted_by:null}).sort({createdAt:-1}).lean()
    },

    getCustomer:async(body)=> {
        const {userId} = body;
        return await Customer.find({user_id:userId, deleted_by:null}).lean()
    },

    updateCustomer:async(body) => {
        const {userId,first_name, last_name, business_name,  address, age_verification, phone_number, gender, date_of_birth} = body;
        await User.findOneAndUpdate({_id:userId},{
            first_name:first_name,
            last_name:last_name,
        }).lean();

       return await Customer.findOneAndUpdate({user_id:userId},{
        first_name, last_name, business_name, email, address, age_verification, phone_number, gender, date_of_birth
        },{new:true}).lean();
    },

    deleteCustomer:async(body)=> {
        const {userId} = body;
        await User.findOneAndUpdate({_id:userId, deleted_by:null}, {deleted_by:userId});
      return await Customer.findOneAndUpdate({user_id:userId, deleted_by:null}, {deleted_by:userId}).lean();
    }
}
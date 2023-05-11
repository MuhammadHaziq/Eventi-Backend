const Customer = require("../../models/Customers");
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

module.exports = {
    // addCustomer:async(body)=> {
    //     const {first_name, last_name, business_name, email, address, age_verification, phone_number, gender, date_of_birth, user_type, password} = body;
    //     /** Add Customer In User Schema*/
    //     const addUser = new User({
    //         first_name:first_name,
    //         last_name:last_name,
    //         email:email,
    //         password:password,
    //         user_type:user_type || "customer"
    //     });
    //    await addUser.save().then(async newUser=> {
    //         /** Add Customer In Customer Schema*/
    //         const addCustomer = new Customer({
    //             user_id:newUser._id, first_name, last_name, business_name, email, address, age_verification, phone_number, gender, date_of_birth
    //         })
    //         return await addCustomer.save()
    //       }).catch(err=> {
    //             error.status = 'VALIDATION_ERR';
    //             error.message = `User Not Created (${err.message})`;
    //             throw error
    //       });
    // },

    addCustomer:async(body)=> {
        try{
            const {first_name, last_name, business_name, email, address, age_verification, phone_number, gender, date_of_birth, user_type, password} = body;
            /** Add Customer In User Schema*/
            const addUser = new User({
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
            await addUser.save()
            return await User.findOne({email:email}).lean(); 
        }catch(err){
            error.status = 'VALIDATION_ERR';
            error.message = `User Not Created (${err?.keyValue ? Object.values(err?.keyValue):err.message}) ${err?.code === 11000 ? "Already Exist" : ""}`;
            throw error
        }
     
    },

    getCustomers:async()=> {
        return await Customer.find({deleted_by:null}).sort({createdAt:-1}).lean()
    },

    getCustomer:async(body)=> {
        const {user_id} = body;
        return await Customer.findOne({user_id:user_id, deleted_by:null}).lean()
    },

    updateCustomer:async(body) => {
        const {userId, first_name, last_name, business_name,  address, age_verification, phone_number, gender, date_of_birth, user_id} = body;
        await Customer.findOneAndUpdate({user_id:userId, deleted_at:null},{
            first_name, last_name, business_name, address, age_verification, phone_number, gender, date_of_birth, updated_by:user_id
            },{new:true}).lean();

        return await User.findOneAndUpdate({_id:userId, deleted_at:null},{
            first_name:first_name,
            last_name:last_name,
            business_name:business_name,
            address:address,
            age_verification:age_verification, 
            phone_number:phone_number, 
            gender:gender, 
            date_of_birth:date_of_birth,
            updated_by:user_id
        },{new:true}).lean();
    },

    deleteCustomer:async(body)=> {
        const {user_id, userId} = body;
        await Customer.findOneAndUpdate({user_id:userId, deleted_at:null}, {deleted_by:user_id, deleted_at:new Date()});
        return await User.findOneAndUpdate({_id:userId, deleted_at:null}, {deleted_by:user_id, deleted_at:new Date()}, {new:true}).lean();
    }
}
const Vendor = require("../../models/Vendors");
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

module.exports = {
    // addVendor:async(body)=> {
    //     const { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender, user_type, password} = body;
    //     /** Add Vendor In User Schema*/
    //     const addUser = new User({
    //         first_name:first_name,
    //         last_name:last_name,
    //         email:email,
    //         password:password,
    //         user_type:user_type || "vendor"
    //     });
    //    await addUser.save(async newUser => {
    //          /** Add Vendor In Vendor Schema*/
    //         const addVendor = new Vendor({
    //             user_id:newUser._id, business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender
    //         });
    //         return await addVendor.save()
    //       }).catch(err=> {
    //         error.status = 'VALIDATION_ERR';
    //         error.message = `User Not Created (${err.message})`;
    //         throw error
    //       });
    // },

    addVendor: async (body) => {
        try{
            const { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender, user_type, password } = body;
        /** Add Vendor In User Schema*/
        const addUser = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            user_type: user_type || "vendor",
            business_name: business_name,
            address: address, 
            phone_number: phone_number,
            date_of_birth: date_of_birth, 
            gender: gender
        });
        await addUser.save();
        return await User.findOne({email:email}).lean();

        }catch(err){
            error.status = 'VALIDATION_ERR';
            error.message = `User Not Created (${err?.keyValue ? Object.values(err?.keyValue):err.message}) ${err?.code === 11000 ? "Already Exist" : ""}`;
            throw error
        }
    },

    getVendors: async () => {
        return await Vendor.find({ deleted_by: null }).sort({ createdAt: -1 }).lean();
    },

    getVendor: async (body) => {
        const { user_id } = body;
        return await Vendor.find({ user_id: user_id, deleted_by: null }).lean();
    },

    updateVendor: async (body) => {
        const { userId, user_id, business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender } = body;
        await Vendor.findOneAndUpdate({ user_id: userId, deleted_at:null }, { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender,updated_by:user_id }, { new: true }).lean();
        
        return await User.findOneAndUpdate({ _id: userId, deleted_at:null  }, {
            first_name: first_name,
            last_name: last_name,
            business_name:business_name,
            address:address,
            phone_number:phone_number, 
            gender:gender, 
            date_of_birth:date_of_birth,
            updated_by:user_id
        }, { new: true }).lean();

         
    },

    deleteVendor: async (body) => {
        const { user_id, userId } = body;
        await Vendor.findOneAndUpdate({user_id: userId, deleted_at:null}, { deleted_by: user_id, deleted_at:new Date() }).lean();
        return await User.findOneAndUpdate({ _id: userId, deleted_at:null}, { deleted_by: user_id, deleted_at:new Date() }, {new:true}).lean();
    }
}
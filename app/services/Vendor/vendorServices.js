const Vendor = require("../../models/Vendors");
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

module.exports = {
    addVendor:async(body)=> {
        const { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender, user_type, password} = body;
        /** Add Vendor In User Schema*/
        const addUser = new User({
            first_name:first_name,
            last_name:last_name,
            email:email,
            password:password,
            user_type:user_type || "vendor"
        });
       await addUser.save(async function(err, newUser) {
            if (err) {
                error.status = 'VALIDATION_ERR';
                error.message = `User Not Created (${err.message})`;
                throw error
            }
            /** Add Vendor In Vendor Schema*/
            const addVendor = new Vendor({
                user_id:newUser._id, business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender
            });
            return await addVendor.save()
          });
    },

    getVendors:async()=> {
        return await Vendor.find({deleted_by:null}).sort({createdAt:-1}).lean();
    },

    getVendor:async(body)=> {
        const {userId} = body;
        return await Vendor.find({user_id:userId, deleted_by:null}).lean();
    },

    updateVendor:async(body) => {
        const {userId, business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender} = body;
        await User.findOneAndUpdate({_id:userId},{
            first_name:first_name,
            last_name:last_name,
        });

       return await Vendor.findOneAndUpdate({user_id:userId},{ business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender },{new:true}).lean();
    },

    deleteVendor:async(body)=> {
        const {userId} = body;
        await User.findOneAndUpdate({_id:userId, deleted_by:null}, {deleted_by:userId});
       return await Vendor.findOneAndUpdate({user_id:userId, deleted_by:null}, {deleted_by:userId}).lean();
    }
}
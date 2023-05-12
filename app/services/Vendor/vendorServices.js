const Vendor = require("../../models/Vendors");
const User = require("../../models/Users")

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

const select = ["first_name", "last_name", "email", "business_name", "address", "age_verification", "gender", "date_of_birth", "phone_number", "deleted_by", "updated_by", "deleted_at", "createdAt", "updatedAt"];

module.exports = {
    addVendor: async (body) => {
        try{
            const { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender, user_type, password } = body;
        /** Add Vendor In Schema*/
        const addVendor = new Vendor({
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
        await addVendor.save();
        return await User.findOne({email:email}).lean();

        }catch(err){
            error.status = 'VALIDATION_ERR';
            error.message = `User Not Created (${err?.keyValue ? Object.values(err?.keyValue):err.message}) ${err?.code === 11000 ? "Already Exist" : ""}`;
            throw error
        }
    },

    getVendors: async () => {
        return await Vendor.find({ deleted_by: null }).select(select).sort({ createdAt: -1 }).lean();
    },

    getVendor: async (body) => {
        const { vendorId } = body;
        return await Vendor.find({ _id: vendorId, deleted_by: null }).select(select).lean();
    },

    updateVendor: async (body) => {
        const { vendorId, user_id, business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender } = body;
        return await Vendor.findOneAndUpdate({ _id: vendorId, deleted_at:null }, { business_name, first_name, last_name, email, address, phone_number, date_of_birth, gender,updated_by:user_id }, { new: true }).lean();
        
    },

    deleteVendor: async (body) => {
        const { user_id, vendorId } = body;
        return await Vendor.findOneAndUpdate({_id: vendorId, deleted_at:null}, { deleted_by: user_id, deleted_at:new Date() }, {new:true}).lean();
    }
}
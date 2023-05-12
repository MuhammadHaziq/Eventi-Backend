const User = require("../Users");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema(
    {
        first_name: { type: String, required: true, trim: true, index: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, trim: true, required:true, unique:true },
        password: { type: String, trim: true,set: helper.encrypt, required:true },
        business_name: { type: String, required: true, trim: true, index: true },
        address: { type: String, trim: true },
        date_of_birth:{ type: String, trim: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required:true },
        phone_number: { type: String, trim: true, required:true },
        deleted_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        updated_by:{type: Schema.Types.ObjectId, ref: 'User', default:null},
        deleted_at:{ type: Date, default: null}
    },
    {
        timestamps: true
    }
);

/** Save Record In User Schema */
VendorSchema.post("save", async (doc)=> {
    const existUser = await User.findOne({email:doc.email}).lean();
    if(existUser){
        await User.findOneAndUpdate({email:doc.email}, {user_type:"vendor", vendor_id:doc._id})
    }else{
        const addUser = new User({
            first_name:doc.first_name,
            last_name:doc.last_name,
            email:doc.email,
            user_type:"vendor",
            phone_number:doc.phone_number,
            vendor_id:doc._id, 
        });
        await addUser.save();
    }
});

/** Delete / Update Record In User Schema */
VendorSchema.post("findOneAndUpdate", async (doc)=> {
    await User.findOneAndUpdate({email:doc.email, vendor_deleted:false}, {vendor_deleted:doc.deleted_at ? true :false, vendor_deleted_by:doc.deleted_at ? doc._id : null,first_name:doc.first_name, last_name:doc.last_name, email:doc.email, user_type:"vendor", phone_number:doc.phone_number,}).lean();
});

module.exports = mongoose.model('Vendor', VendorSchema);
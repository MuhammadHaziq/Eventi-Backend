// const Account = require("../Accounts");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    account_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    first_name: { type: String, required: true, trim: true, index: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    // email: { type: String, trim: true, unique: true },
    password: { type: String, trim: true, set: helper.encrypt, required: true },
    business_name: { type: String, required: false, trim: true, default: null },
    address: { type: String, trim: true, default: null },
    age_verification: { type: String, trim: true, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    date_of_birth: { type: String, trim: true, default: null },
    phone_number: { type: String, trim: true, default: null },
    attende_id: {
      type: Schema.Types.ObjectId,
      ref: "Attendess",
      default: null,
    },
    deleted_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

/** Save Record In Account Schema */
// CustomerSchema.post("save", async (doc) => {
//   const existUser = await Account.findOne({ email: doc.email }).lean();
//   if (existUser) {
//     await Account.findOneAndUpdate(
//       { email: doc.email },
//       { user_type: "customer", customer_id: doc._id }
//     );
//   } else {
//     const addUser = new Account({
//       first_name: doc.first_name,
//       last_name: doc.last_name,
//       email: doc.email,
//       user_type: "customer",
//       phone_number: doc.phone_number,
//       customer_id: doc._id,
//     });
//     await addUser.save();
//   }
// });

/** Delete / Update Record In Account Schema */
// CustomerSchema.post("findOneAndUpdate", async (doc) => {
//   await Account.findOneAndUpdate(
//     { email: doc.email, customer_deleted: false },
//     {
//       customer_deleted: doc.deleted_at ? true : false,
//       customer_deleted_by: doc.deleted_at ? doc._id : null,
//       first_name: doc.first_name,
//       last_name: doc.last_name,
//       email: doc.email,
//       user_type: doc.deleted_at && "vendor",
//       phone_number: doc.phone_number,
//     }
//   ).lean();
// });

module.exports = mongoose.model("Customer", CustomerSchema);

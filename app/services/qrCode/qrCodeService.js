const appConfig = require("../../../config/appConfig");
const ObjectId = require("mongoose").Types.ObjectId;
const Customer = require("../../models/customers");

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const select = [
  "account_id",
  "first_name",
  "last_name",
  "email",
  "business_name",
  "address",
  "age_verification",
  "gender",
  "date_of_birth",
  "phone_number",
  "deleted_by",
  "updated_by",
  "deleted_at",
  "createdAt",
  "updatedAt",
];

const getAccountFilter = (userType, authAccount) => {
  const filter = {};
  if (userType !== "admin") {
    return filter;
  }
  return (filter.created_by = authAccount);
};

const qrCodeService = {

  getQRCode: async (body) => {
      const { _id } = body;
      console.log(body);
    return await Customer.findOne({
        _id: new ObjectId(_id),
      deleted_at: { $eq: null },
    })
      
       .lean();
  },


};
module.exports = qrCodeService;
 
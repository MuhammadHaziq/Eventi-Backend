const Vendor = require("../../models/Vendors");
const Account = require("../../models/Accounts");

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const vendorFilters = (filters) => {
  if (filters) {
    if (filters.gender) {
      filters.gender = { $regex: filters.gender, $options: "i" };
    } else {
      delete filters.gender;
    }
    if (filters.age_verification) {
      filters.age_verification = {
        $regex: filters.age_verification,
        $options: "i",
      };
    } else {
      delete filters.age_verification;
    }
    if (filters.address) {
      filters.address = { $regex: filters.address, $options: "i" };
    } else {
      delete filters.address;
    }
    if (filters.business_name) {
      filters.business_name = { $regex: filters.business_name, $options: "i" };
    } else {
      delete filters.business_name;
    }
    if (filters.first_name) {
      filters.first_name = { $regex: filters.first_name, $options: "i" };
    } else {
      delete filters.first_name;
    }
    if (filters.last_name) {
      filters.last_name = {
        $regex: filters.last_name,
        $options: "i",
      };
    } else {
      delete filters.last_name;
    }
    if (filters.phone_number) {
      filters.phone_number = { $regex: filters.phone_number, $options: "i" };
    } else {
      delete filters.phone_number;
    }
    if (filters.email) {
      filters.email = {
        $regex: filters.email,
        $options: "i",
      };
    } else {
      delete filters.email;
    }
  }

  return { ...filters, deleted_at: null };
};

const select = [
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

module.exports = {
  addVendor: async (body) => {
    try {
      const {
        business_name,
        first_name,
        last_name,
        email,
        address,
        phone_number,
        date_of_birth,
        gender,
        user_type,
        password,
        account_id,
      } = body;
      /** Add Vendor In Schema*/
      const addVendor = new Vendor({
        account_id: account_id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        user_type: user_type || "vendor",
        business_name: business_name,
        address: address,
        phone_number: phone_number,
        date_of_birth: date_of_birth,
        gender: gender,
      });
      await addVendor.save();
      return await Account.findOne({ email: email }).lean();
    } catch (err) {
      error.status = "VALIDATION_ERR";
      error.message = `Account Not Created (${
        err?.keyValue ? Object.values(err?.keyValue) : err.message
      }) ${err?.code === 11000 ? "Already Exist" : ""}`;
      throw error;
    }
  },

  getVendors: async (body) => {
    const { perPage, page, tableFilters, sort } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    const totalRecord = await Vendor.find(vendorFilters(filters)).count();
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Vendor.find(vendorFilters(filters))
      .select(select)
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getVendor: async (body) => {
    const { vendorId } = body;
    return await Vendor.findOne({ _id: vendorId, deleted_by: null })
      .select(select)
      .lean();
  },

  updateVendor: async (body) => {
    const {
      vendorId,
      user_id,
      business_name,
      first_name,
      last_name,
      email,
      address,
      phone_number,
      date_of_birth,
      gender,
    } = body;
    return await Vendor.findOneAndUpdate(
      { _id: vendorId, deleted_at: null },
      {
        business_name,
        first_name,
        last_name,
        email,
        address,
        phone_number,
        date_of_birth,
        gender,
        updated_by: user_id,
      },
      { new: true }
    ).lean();
  },

  deleteVendor: async (body) => {
    const { user_id, vendorId } = body;
    return await Vendor.findOneAndUpdate(
      { _id: vendorId, deleted_at: null },
      { deleted_by: user_id, deleted_at: new Date() },
      { new: true }
    ).lean();
  },

  checkVendor: async (email) => {
    return await Vendor.findOne({ email: email }).count();
  },
};

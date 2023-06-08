const Vendor = require("../../models/vendors");
const Account = require("../../models/accounts");
const ObjectId = require("mongoose").Types.ObjectId;

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const vendorFilters = (filters, user_type, authAccount) => {
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

  if (user_type !== "admin") {
    filters = { account_id: authAccount };
  }

  return { ...filters, deleted_by: { $eq: null } };
};

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
      return await Account.findOne({
        email: email,
        user_type: user_type,
      }).lean();
    } catch (err) {
      error.status = "VALIDATION_ERR";
      error.message = `Account Not Created (${
        err?.keyValue ? Object.values(err?.keyValue) : err.message
      }) ${err?.code === 11000 ? "Already Exist" : ""}`;
      throw error;
    }
  },

  getVendors: async (body) => {
    const { perPage, page, tableFilters, sort, user_type, authAccount } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    const totalRecord = await Vendor.find(
      vendorFilters(filters, user_type, authAccount)
    ).count();
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Vendor.find(
      vendorFilters(filters, user_type, authAccount)
    )
      .select(select)
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getVendor: async (body) => {
    const { account_id } = body;
    return await Vendor.findOne({
      account_id: new ObjectId(account_id),
      deleted_by: { $eq: null },
    })
      .select(select)
      .lean();
  },

  updateVendor: async (body) => {
    const {
      account_id,
      authAccount,
      business_name,
      first_name,
      last_name,
      address,
      phone_number,
      date_of_birth,
      gender,
    } = body;
    await Account.updateOne(
      {
        _id: new ObjectId(account_id),
        deleted_at: { $eq: null },
      },
      { first_name, last_name, phone_number, updated_by: authAccount }
    );
    return await Vendor.findOneAndUpdate(
      { account_id: new ObjectId(account_id), deleted_at: { $eq: null } },
      {
        business_name,
        first_name,
        last_name,
        address,
        phone_number,
        date_of_birth,
        gender,
        updated_by: authAccount,
      },
      { new: true }
    ).lean();
  },

  deleteVendor: async (body) => {
    const { authAccount, account_id } = body;
    await Account.updateOne(
      {
        _id: new ObjectId(account_id),
        deleted_at: { $eq: null },
      },
      { deleted_by: authAccount, deleted_at: new Date() }
    );
    return await Vendor.findOneAndUpdate(
      { account_id: new ObjectId(account_id), deleted_at: { $eq: null } },
      { deleted_by: authAccount, deleted_at: new Date() },
      { new: true }
    ).lean();
  },

  checkVendor: async (email) => {
    return await Vendor.findOne({
      email: email,
      deleted_by: { $eq: null },
    }).count();
  },
};

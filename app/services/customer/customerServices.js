const Customer = require("../../models/customers");
const Payment = require("../../models/payment");
const Event = require("../../models/events");
const Account = require("../../models/accounts");
const ObjectId = require("mongoose").Types.ObjectId;

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const customerFilters = (filters, user_type, authAccount) => {
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

const getAccountFilter = (userType, authAccount) => {
  const filter = {};
  if (userType !== "admin") {
    return filter;
  }
  return (filter.account_id = authAccount);
};

const customerService = {
  addCustomer: async (body) => {
    try {
      const {
        first_name,
        last_name,
        business_name,
        email,
        address,
        age_verification,
        phone_number,
        gender,
        date_of_birth,
        user_type,
        password,
        account_id,
      } = body;
      /** Add Customer In Customer Schema*/
      const addCustomer = new Customer({
        account_id: account_id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        user_type: user_type || "customer",
        business_name: business_name,
        address: address,
        age_verification: age_verification,
        phone_number: phone_number,
        gender: gender,
        date_of_birth: date_of_birth,
      });
      await addCustomer.save();
      return await Account.findOne({
        email: email,
        user_type: user_type,
      }).lean();
    } catch (err) {
      error.status = "VALIDATION_ERR";
      error.message = `Customer Not Created (${
        err?.keyValue ? Object.values(err?.keyValue) : err.message
      }) ${err?.code === 11000 ? "Already Exist" : ""}`;
      throw error;
    }
  },

  getCustomers: async (body) => {
    const { perPage, page, tableFilters, sort, user_type, authAccount } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    /** Query Filter */
    const customerFilter = customerFilters(filters, user_type, authAccount);
    /** Query Records */
    const totalRecord = await Customer.find(customerFilter).count();
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Customer.find(customerFilter)
      .select(select)
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getCustomer: async (body) => {
    const { account_id } = body;
    return await Customer.findOne({
      account_id: new ObjectId(account_id),
      deleted_by: { $eq: null },
    })
      .select(select)
      .lean();
  },

  updateCustomer: async (body) => {
    const {
      account_id,
      first_name,
      last_name,
      business_name,
      address,
      age_verification,
      phone_number,
      gender,
      date_of_birth,
      authAccount,
    } = body;
    const exist = await customerService.getCustomer({ account_id });
    if (exist) {
      await Account.updateOne(
        {
          _id: new ObjectId(account_id),
          deleted_at: { $eq: null },
        },
        { first_name, last_name, phone_number, updated_by: authAccount }
      );
      return await Customer.findOneAndUpdate(
        { account_id: new ObjectId(account_id), deleted_at: { $eq: null } },
        {
          first_name,
          last_name,
          business_name,
          address,
          age_verification,
          phone_number,
          gender,
          date_of_birth,
          updated_by: authAccount,
        },
        { new: true }
      ).lean();
    }
    return false;
  },

  deleteCustomer: async (body) => {
    const { authAccount, account_id } = body;
    const exist = await customerService.getCustomer({ account_id });
    if (exist) {
      await Account.updateOne(
        {
          _id: new ObjectId(account_id),
          deleted_at: { $eq: null },
        },
        { deleted_by: authAccount, deleted_at: new Date() }
      );
      return await Customer.findOneAndUpdate(
        { account_id: account_id, deleted_at: null },
        { deleted_by: authAccount, deleted_at: new Date() },
        { new: true }
      ).lean();
    }
    return false;
  },

  getCustPaymentHistory: async (body) => {
    const { sort, user_type, authAccount, account_id } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    return await Payment.aggregate([
      [
        {
          $lookup: {
            from: "attendesses",
            localField: "event_id",
            foreignField: "event_id",
            as: "attendes",
          },
        },
        {
          $match: {
            "attendes.account_id": new ObjectId(account_id),
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "event_id",
            foreignField: "_id",
            as: "event_id",
          },
        },
        {
          $unwind: {
            path: "$event_id",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "accounts",
            localField: "account_id",
            foreignField: "_id",
            as: "account_id",
          },
        },
        {
          $unwind: {
            path: "$account_id",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            [sorter?.value || "createdAt"]: sorter?.state || -1,
          },
        },
      ],
    ]);
    // return await Payment.find({
    //   account_id: new ObjectId(account_id),
    //   deleted_by: { $eq: null },
    // })
    //   .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
    //   .populate("event_id")
    //   .populate("account_id");
  },

  checkCustomer: async (email) => {
    return await Customer.findOne({
      email: email,
      deleted_by: { $eq: null },
    }).count();
  },
};
module.exports = customerService;

const customerService = require("../Customer/customerServices");
const vendorService = require("../Vendor/vendorServices");
const Account = require("../../models/Accounts");
const { adminNav, vendorNav, customerNav } = require("../../../utils/_nav");
const ObjectId = require("mongoose").Types.ObjectId;

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const select_user = [
  "first_name",
  "last_name",
  "email",
  "user_type",
  "createdAt",
  "updatedAt",
  "updated_by",
  "deleted_at",
  "deleted_by",
];

const vendorLookUp = [
  {
    $lookup: {
      from: "vendors",
      as: "vendors",
      localField: "_id",
      foreignField: "account_id",
    },
  },
  { $unwind: { path: "$vendors", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      account_id: "$_id",
      user_id: "$vendors._id",
      first_name: "$first_name",
      last_name: "$last_name",
      email: "$email",
      user_type: "$user_type",
      deleted_by: "$deleted_by",
      password: "$vendors.password",
      business_name: "$vendors.business_name",
      date_of_birth: "$vednors.date_of_birth",
      gender: "$vendors.gender",
      phone_number: "$phone_number",
    },
  },
];

const customerLookUp = [
  {
    $lookup: {
      from: "customers",
      as: "customers",
      localField: "_id",
      foreignField: "account_id",
    },
  },
  { $unwind: { path: "$customers", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      account_id: "$_id",
      user_id: "$customers._id",
      first_name: "$first_name",
      last_name: "$last_name",
      email: "$email",
      user_type: "$user_type",
      deleted_by: "$deleted_by",
      password: "$customers.password",
      business_name: "$customers.business_name",
      date_of_birth: "$customers.date_of_birth",
      gender: "$customers.gender",
      phone_number: "$phone_number",
    },
  },
];

const newUser = async (body) => {
  const addUser = new Account({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    user_type: body.user_type,
    phone_number: body.phone_number,
    userRef: body.user_type === "vendor" ? "Vendors" : "Customers",
  });
  return await addUser.save();
};

const accountService = {
  login: async (body) => {
    const { email, password, user_type } = body;
    let selectedUser = {};
    let permission = adminNav;
    if (user_type === "vendor") {
      selectedUser = await Account.aggregate([
        { $match: { email: email, user_type: user_type } },
        ...vendorLookUp,
      ]);
      permission = vendorNav;
    } else {
      selectedUser = await Account.aggregate([
        { $match: { email: email, user_type: user_type } },
        ...customerLookUp,
      ]);
      permission = customerNav;
    }
    selectedUser = selectedUser?.[0] || "";
    if (selectedUser && !selectedUser.deleted_by) {
      if (helper.decrypt(selectedUser?.password) === password) {
        delete selectedUser?.password;
        const user = { ...selectedUser, permissions: permission };
        return await helper.jwt.createJWT(null, user);
      }

      error.status = "UNAUTHORIZED";
      error.message = `Account unauthorize to access system`;
      throw error;
    }
    error.status = "NOT_FOUND";
    // error.message = `Account not exist in system`;
    error.message = "Account unauthorize to access system";
    throw error;
  },

  addUser: async (body) => {
    const { user_type, email } = body;
    if (user_type?.toLowerCase() === "customer") {
      /** Add Customer In Customer Schema*/
      const customerExist = await customerService.checkCustomer(email);
      if (!customerExist) {
        const addedUser = await newUser(body);
        return await customerService.addCustomer({
          ...body,
          account_id: addedUser?._id,
        });
      } else {
        error.status = "VALIDATION_ERR";
        error.message = `User Not Created (Email Already Exist)`;
        throw error;
      }
    } else {
      /** Add Vendor In Vendor Schema*/
      const customerExist = await vendorService.checkVendor(email);
      if (!customerExist) {
        const addedUser = await newUser(body);
        return await vendorService.addVendor({
          ...body,
          account_id: addedUser?._id,
        });
      } else {
        error.status = "VALIDATION_ERR";
        error.message = `User Not Created (Email Already Exist)`;
        throw error;
      }
    }
  },

  getUsers: async () => {
    return await Account.aggregate([
      {
        $match: { deleted_by: { $eq: null } },
      },
      {
        $lookup: {
          from: "vendors",
          as: "vendors",
          localField: "_id",
          foreignField: "account_id",
        },
      },
      { $unwind: { path: "$vendors", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "customers",
          as: "customers",
          localField: "_id",
          foreignField: "account_id",
        },
      },
      { $unwind: { path: "$customers", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          account_id: "$_id",
          first_name: "$first_name",
          last_name: "$last_name",
          email: "$email",
          user_type: "$user_type",
          customers: "$customers",
          vendor: "$vendors",
          customer_id: "$customers._id",
          vendor_id: "$vendors._id",
          deleted_by: "$deleted_by",
          deleted_at: "$deleted_at",
        },
      },
    ]);
  },

  getUser: async (body) => {
    const { account_id } = body;
    const userType = await accountService.getUserType(account_id);
    let lookUps = customerLookUp;
    let permission = adminNav;
    if (userType === "vendor") {
      lookUps = vendorLookUp;
      permission = vendorNav;
    }
    if (userType === "customer") {
      lookUps = customerLookUp;
      permission = customerNav;
    }
    const data = await Account.aggregate([
      {
        $match: {
          _id: new ObjectId(account_id),
          user_type: userType,
          deleted_by: { $eq: null },
        },
      },
      ...lookUps,
    ]);
    if (data && data?.length > 0) {
      return { data, permissions: permission };
    }
    return null;
  },

  updateUser: async (body) => {
    const { account_id, first_name, last_name, phone_number } = body;
    const user_type = await accountService.getUserType(account_id);
    const user = await Account.findOneAndUpdate(
      {
        _id: new ObjectId(account_id),
      },
      { first_name, last_name, phone_number },
      { new: true }
    ).lean();
    if (user_type?.toLowerCase() === "customer") {
      return await customerService.updateCustomer({
        ...body,
        account_id: user?._id,
      });
    } else {
      return await vendorService.updateVendor({
        ...body,
        account_id: user?._id,
      });
    }
  },

  deleteUser: async (body) => {
    const { account_id } = body;
    const user_type = await accountService.getUserType(account_id);
    const user = await Account.findOneAndUpdate(
      {
        _id: new ObjectId(account_id),
      },
      { deleted_by: account_id, deleted_at: new Date() },
      { new: true }
    ).lean();
    if (user_type?.toLowerCase() === "customer") {
      return await customerService.deleteCustomer({
        ...body,
        account_id: user?._id,
      });
    } else {
      return await vendorService.deleteVendor({
        ...body,
        account_id: user?._id,
      });
    }
  },

  getUserType: async (account_id) => {
    const data = await Account.findById({ _id: new ObjectId(account_id) })
      .select("user_type")
      .lean();
    return data?.user_type;
  },
};

module.exports = accountService;

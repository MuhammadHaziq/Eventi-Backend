const customerService = require("../customer/customerServices");
const vendorService = require("../vendor/vendorServices");
const Account = require("../../models/accounts");
const { adminNav, vendorNav, customerNav } = require("../../../utils/_nav");
const adminService = require("../admin/adminService");
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

const adminLookUp = [
  {
    $lookup: {
      from: "admins",
      as: "admins",
      localField: "_id",
      foreignField: "account_id",
    },
  },
  { $unwind: { path: "$admins", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      account_id: "$_id",
      user_id: "$admins._id",
      first_name: "$first_name",
      last_name: "$last_name",
      email: "$email",
      user_type: "$user_type",
      deleted_by: "$deleted_by",
      password: "$admins.password",
      business_name: "$admins.business_name",
      date_of_birth: "$admins.date_of_birth",
      gender: "$admins.gender",
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
    userRef:
      body.user_type === "vendor"
        ? "Vendor"
        : body.user_type === "customer"
        ? "Customer"
        : "Admin",
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
        {
          $match: {
            email: email,
            user_type: user_type,
            deleted_by: { $eq: null },
          },
        },
        ...vendorLookUp,
      ]);
      permission = vendorNav;
    } else if (user_type === "customer") {
      selectedUser = await Account.aggregate([
        {
          $match: {
            email: email,
            user_type: user_type,
            deleted_by: { $eq: null },
          },
        },
        ...customerLookUp,
      ]);
      permission = customerNav;
    } else if (user_type === "admin") {
      selectedUser = await Account.aggregate([
        {
          $match: {
            email: email,
            user_type: user_type,
            deleted_by: { $eq: null },
          },
        },
        ...adminLookUp,
      ]);
      permission = adminNav;
    } else {
      error.status = "NOT_FOUND";
      error.message = "Account unauthorize to access system";
      throw error;
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
    const { email, password, user_type } = body;
    if (user_type?.toLowerCase() === "customer") {
      /** Add Customer In Customer Schema*/
      const customerExist = await customerService.checkCustomer(email);
      if (!customerExist) {
        const addedUser = await newUser(body);
        const currentUser = await customerService.addCustomer({
          ...body,
          account_id: addedUser?._id,
        });
        const token = await accountService.login({
          email,
          password,
          user_type,
        });
        return { ...currentUser, token };
      } else {
        error.status = "VALIDATION_ERR";
        error.message = `User Not Created (Email Already Exist)`;
        throw error;
      }
    } else if (user_type?.toLowerCase() === "vendor") {
      /** Add Vendor In Vendor Schema*/
      const customerExist = await vendorService.checkVendor(email);
      if (!customerExist) {
        const addedUser = await newUser(body);
        const currentUser = await vendorService.addVendor({
          ...body,
          account_id: addedUser?._id,
        });
        const token = await accountService.login({
          email,
          password,
          user_type,
        });
        return { ...currentUser, token };
      } else {
        error.status = "VALIDATION_ERR";
        error.message = `User Not Created (Email Already Exist)`;
        throw error;
      }
    } else if (user_type?.toLowerCase() === "admin") {
      /** Add Admin In Admin Schema*/
      const adminExist = await adminService.checkAdmin(email);
      if (!adminExist) {
        const addedUser = await newUser(body);
        const currentUser = await adminService.addAdmin({
          ...body,
          account_id: addedUser?._id,
        });
        const token = await accountService.login({
          email,
          password,
          user_type,
        });
        return { ...currentUser, token };
      } else {
        error.status = "VALIDATION_ERR";
        error.message = `User Not Created (Email Already Exist)`;
        throw error;
      }
    } else {
      error.status = "BAD_REQUEST";
      error.message = `User Not Created`;
      throw error;
    }
  },

  getUsers: async () => {
    return await Account.find({ deleted_by: { $eq: null } }).lean();
  },

  getUser: async (body) => {
    const { account_id } = body;
    const userType = await accountService.getUserType(account_id);
    let permission = adminNav;
    if (userType === "vendor") {
      permission = vendorNav;
    }
    if (userType === "customer") {
      permission = customerNav;
    }

    const data = await Account.findOne({
      _id: new ObjectId(account_id),
      deleted_by: { $eq: null },
    }).lean();

    if (data) {
      return { data, permissions: permission };
    }
    return null;
  },

  updateUser: async (body) => {
    const { account_id, authAccount } = body;
    const user_type = await accountService.getUserType(account_id);

    if (user_type?.toLowerCase() === "customer") {
      return await customerService.updateCustomer({
        ...body,
        account_id: account_id,
        authAccount: authAccount,
      });
    } else if (user_type?.toLowerCase() === "vendor") {
      return await vendorService.updateVendor({
        ...body,
        account_id: account_id,
        authAccount: authAccount,
      });
    } else if (user_type?.toLowerCase() === "admin") {
      return await adminService.updateAdmin({
        ...body,
        account_id: account_id,
        authAccount: authAccount,
      });
    } else {
      error.status = "BAD_REQUEST";
      error.message = `User Not Created`;
      throw error;
    }
  },

  deleteUser: async (body) => {
    const { account_id, authAccount } = body;
    const user_type = await accountService.getUserType(account_id);

    if (user_type?.toLowerCase() === "customer") {
      return await customerService.deleteCustomer({
        ...body,
        account_id: account_id,
        authAccount: authAccount,
      });
    } else if (user_type?.toLowerCase() === "vendor") {
      return await vendorService.deleteVendor({
        ...body,
        account_id: account_id,
        authAccount: authAccount,
      });
    } else if (user_type?.toLowerCase() === "admin") {
      return await adminService.deleteAdmin({
        ...body,
        account_id: account_id,
        authAccount: authAccount,
      });
    } else {
      error.status = "BAD_REQUEST";
      error.message = `User Not Created`;
      throw error;
    }
  },

  getUserType: async (account_id) => {
    const data = await Account.findById({ _id: new ObjectId(account_id) })
      .select("user_type")
      .lean();
    return data?.user_type;
  },

  addAttendeUser: async (body) => {
    try {
      const { email } = body;
      /** Add Customer In Customer Schema*/
      const customerExist = await customerService.getCustomerEmail(email);
      if (!customerExist) {
        const addedUser = await newUser(body);
        await customerService.addAttendeCustomer({
          ...body,
          account_id: addedUser?._id,
        });
        const newdata = await customerService.getCustomerEmail(email);
        return { ...newdata, new: true };
      } else {
        return { ...customerExist };
      }
    } catch (error) {
      error.status = "BAD_REQUEST";
      error.message = error.message;
      throw error;
    }
  },
};

module.exports = accountService;

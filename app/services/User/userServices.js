const customerService = require("../Customer/customerServices");
const vendorService = require("../Vendor/vendorServices");
const User = require("../../models/Users");
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
      localField: "vendor_id",
      foreignField: "_id",
    },
  },
  { $unwind: { path: "$vendors", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      user_id: "$_id",
      first_name: "$first_name",
      last_name: "$last_name",
      email: "$email",
      user_type: "$user_type",
      deleted_by: "$vendor_deleted_by",
      password: "$vendors.password",
      business_name: "$vendors.business_name",
      date_of_birth: "$vednors.date_of_birth",
      gender: "$vendors.gender",
      phone_number: "$phone_number",
      vendor_id: "$vendor_id",
    },
  },
];

const customerLookUp = [
  {
    $lookup: {
      from: "customers",
      as: "customers",
      localField: "customer_id",
      foreignField: "_id",
    },
  },
  { $unwind: { path: "$customers", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      user_id: "$_id",
      first_name: "$first_name",
      last_name: "$last_name",
      email: "$email",
      user_type: "$user_type",
      deleted_by: "$customer_deleted_by",
      password: "$customers.password",
      business_name: "$customers.business_name",
      date_of_birth: "$customers.date_of_birth",
      gender: "$customers.gender",
      phone_number: "$phone_number",
      customer_id: "$customer_id",
    },
  },
];
module.exports = {
  login: async (body) => {
    const { email, password, user_type } = body;
    let selectedUser = {};
    let permission = adminNav;
    if (user_type === "vendor") {
      selectedUser = await User.aggregate([
        { $match: { email: email, user_type: user_type } },
        ...vendorLookUp,
      ]);
      permission = vendorNav;
    } else {
      selectedUser = await User.aggregate([
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
      error.message = `User unauthorize to access system`;
      throw error;
    }
    error.status = "NOT_FOUND";
    error.message = `User not exist in system`;
    throw error;
  },

  addUser: async (body) => {
    const { user_type } = body;
    if (user_type?.toLowerCase() === "customer") {
      /** Add Customer In Customer Schema*/
      return await customerService.addCustomer(body);
    } else {
      /** Add Vendor In Vendor Schema*/
      return await vendorService.addVendor(body);
    }
  },

  getUsers: async () => {
    return await User.aggregate([
      {
        $match: {
          $or: [
            { customer_deleted: { $ne: true } },
            { vendor_deleted: { $ne: true } },
          ],
        },
      },
      {
        $lookup: {
          from: "vendors",
          as: "vendors",
          localField: "vendor_id",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$vendors", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "customers",
          as: "customers",
          localField: "customer_id",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$customers", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user_id: "$_id",
          first_name: "$first_name",
          last_name: "$last_name",
          email: "$email",
          user_type: "$user_type",
          customers: "$customers",
          vendor: "$vendors",
          customer_id: "$customer_id",
          vendor_id: "$vendor_id",
          customer_deleted: "$customer_deleted",
          vendor_deleted: "$vendor_deleted",
        },
      },
    ]);
  },

  getUser: async (body) => {
    const { userId, userType } = body;
    let lookUps = customerLookUp;
    let permission = adminNav;
    let deletedCheck = { customer_deleted: { $ne: true } };
    if (userType === "vendor") {
      lookUps = vendorLookUp;
      deletedCheck = { vendor_deleted: { $ne: true } };
      permission = vendorNav;
    }
    if (userType === "customer") {
      lookUps = customerLookUp;
      permission = customerNav;
      deletedCheck = { customer_deleted: { $ne: true } };
    }
    const data = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
          user_type: userType,
          deletedCheck,
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
    const { user_type } = body;
    const user = await User.findOne({ _id: new ObjectId(body.userId) }).lean();
    if (user_type?.toLowerCase() === "customer") {
      return await customerService.updateCustomer({
        ...body,
        customerId: user?.customer_id,
      });
    } else {
      return await vendorService.updateVendor({
        ...body,
        vendorId: user?.vendor_id,
      });
    }
  },

  deleteUser: async (body) => {
    const { user_type } = body;
    const user = await User.findOne({ _id: new ObjectId(body.userId) }).lean();
    if (user_type?.toLowerCase() === "customer") {
      console.log({ ...body, customerId: user?.customer_id });
      return await customerService.deleteCustomer({
        ...body,
        customerId: user?.customer_id,
      });
    } else {
      return await vendorService.deleteVendor({
        ...body,
        vendorId: user?.vendor_id,
      });
    }
  },
};

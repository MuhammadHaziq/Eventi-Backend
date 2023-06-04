const appConfig = require("../../../config/appConfig");
const Product = require("../../models/Products");

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const productFilters = (filters, user_type, authAccount) => {
  if (filters) {
    if (filters.product_name) {
      filters.product_name = { $regex: filters.product_name, $options: "i" };
    } else {
      delete filters.product_name;
    }
    if (!filters.product_price) {
      delete filters.product_price;
    }
    if (!filters.product_quantity) {
      delete filters.product_quantity;
    }
  }

  if (user_type !== "admin") {
    filters = { created_by: authAccount };
  }

  return { ...filters, deleted_by: { $eq: null } };
};

module.exports = {
  addProduct: async (body) => {
    const { product_name, product_price, product_quantity, authAccount } = body;
    const newProduct = new Product({
      product_name,
      product_price,
      product_quantity,
      created_by: authAccount,
    });
    return await newProduct.save();
  },

  getProducts: async (body) => {
    const { authAccount, perPage, page, tableFilters, sort, user_type } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const totalRecord = await Product.find(
      productFilters(filters, user_type, authAccount)
    ).count();
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Product.find(
      productFilters(filters, user_type, authAccount)
    )
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getProduct: async (body) => {
    const { authAccount, product_id } = body;
    return await Product.findOne({
      _id: product_id,
      created_by: authAccount,
      deleted_at: { $eq: null },
    }).lean();
  },

  updateProduct: async (body) => {
    const {
      product_name,
      product_price,
      product_quantity,
      authAccount,
      product_id,
    } = body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product_id, deleted_at: { $eq: null } },
      {
        product_name,
        product_price,
        product_quantity,
        updated_by: authAccount,
      },
      { new: true }
    ).lean();
    return updatedProduct;
  },

  deleteProduct: async (body) => {
    const { authAccount, product_id } = body;
    return await Product.findOneAndUpdate(
      { _id: product_id, deleted_at: { $eq: null } },
      { deleted_by: authAccount, deleted_at: new Date() },
      { new: true }
    ).lean();
  },
};

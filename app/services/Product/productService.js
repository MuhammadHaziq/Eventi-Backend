const appConfig = require("../../../config/appConfig");
const Product = require("../../models/Products");

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;
const productFilters = (filters, user_id) => {
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

  return { ...filters, created_by: user_id, deleted_at: null };
};

module.exports = {
  addProduct: async (body) => {
    const { product_name, product_price, product_quantity, user_id } = body;
    const newProduct = new Product({
      product_name,
      product_price,
      product_quantity,
      created_by: user_id,
    });
    return await newProduct.save();
  },

  getProducts: async (body) => {
    const { user_id, perPage, page, tableFilters, sort } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const totalRecord = await Product.find(
      productFilters(filters, user_id)
    ).count();
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Product.find(productFilters(filters, user_id))
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getProduct: async (body) => {
    const { user_id, product_id } = body;
    return await Product.findOne({
      _id: product_id,
      created_by: user_id,
      deleted_at: null,
    }).lean();
  },

  updateProduct: async (body) => {
    const {
      product_name,
      product_price,
      product_quantity,
      user_id,
      product_id,
    } = body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product_id, deleted_at: null },
      {
        product_name,
        product_price,
        product_quantity,
        updated_by: user_id,
      },
      { new: true }
    ).lean();
    return updatedProduct;
  },

  deleteProduct: async (body) => {
    const { user_id, product_id } = body;
    return await Product.findOneAndUpdate(
      { _id: product_id, deleted_at: null },
      { deleted_by: user_id, deleted_at: new Date() },
      { new: true }
    ).lean();
  },
};

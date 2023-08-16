const appConfig = require("../../../config/appConfig");
const {
  uploadImages,
  removeFiles,
  removeAllFiles,
} = require("../../../utils/fileHandler");
const Product = require("../../models/products");
const ObjectId = require("mongoose").Types.ObjectId;

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

const getAccountFilter = (userType, authAccount) => {
  const filter = {};
  if (userType !== "admin") {
    return filter;
  }
  return (filter.created_by = authAccount);
};

const productService = {
  addProduct: async (body) => {
    const {
      product_name,
      product_price,
      product_quantity,
      product_points,
      authAccount,
      vendor_account_id,
    } = body;
    try {
      const newProduct = new Product({
        product_name,
        product_price,
        product_quantity,
        product_points,
        vendor_account_id,
        created_by: authAccount,
      });
      const insertedProduct = await newProduct.save();
      if (insertedProduct) {
        const productImages = body.files ? body.files.product_images : null;
        const productId = insertedProduct?._id;

        const images = await productService.saveImages(
          productImages,
          productId
        );
        return await Product.findOneAndUpdate(
          {
            _id: productId,
          },
          {
            product_images: images,
            updated_by: authAccount,
          },
          { new: true }
        ).lean();
      }
    } catch (err) {
      error.status = "BAD_REQUEST";
      error.message = err?.message;
      error.data = null;
      throw error;
    }
  },

  getProducts: async (body) => {
    const {
      authAccount,
      perPage,
      page,
      tableFilters,
      sort,
      user_type,
      no_limit,
    } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    /** Query Filter */
    const productFilter = productFilters(filters, user_type, authAccount);
    /** Query Records */
    const totalRecord = await Product.find(productFilter).count();
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Product.find(productFilter)
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(no_limit ? "" : perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getProduct: async (body) => {
    const { authAccount, product_id, user_type } = body;
    return await Product.findOne({
      _id: product_id,
      ...getAccountFilter(user_type, authAccount),
      deleted_at: { $eq: null },
    }).lean();
  },

  updateProduct: async (body) => {
    const {
      product_name,
      product_price,
      product_quantity,
      product_points,
      authAccount,
      product_id,
      user_type,
      vendor_account_id,
      removed_files,
    } = body;
    try {
      /** Delete Files First */
      if (JSON.parse(removed_files) && JSON.parse(removed_files)?.length > 0) {
        await productService.deleteImages(
          JSON.parse(removed_files),
          product_id
        );
      }

      const productImages = body.files ? body.files.product_images : null;
      let images = await productService.saveImages(productImages, product_id);

      const dbImages =
        (await productService.getProductImages(product_id))?.[0]
          ?.product_images || [];

      images = [
        ...(images || []),
        ...(dbImages || []).filter(function (obj) {
          return (removed_files || []).indexOf(obj) == -1;
        }),
      ];

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: product_id,
          deleted_at: { $eq: null },
          ...getAccountFilter(user_type, authAccount),
        },
        {
          product_name,
          product_price,
          product_quantity,
          product_points,
          vendor_account_id,
          product_images: images,
          updated_by: authAccount,
        },
        { new: true }
      ).lean();
      return updatedProduct;
    } catch (err) {
      error.status = "BAD_REQUEST";
      error.message = err?.message;
      error.data = null;
      throw error;
    }
  },

  deleteProduct: async (body) => {
    const { authAccount, product_id, user_type } = body;
    await productService.deleteAllProductImages(product_id);
    return await Product.findOneAndUpdate(
      {
        _id: product_id,
        deleted_at: { $eq: null },
        ...getAccountFilter(user_type, authAccount),
      },
      { deleted_by: authAccount, deleted_at: new Date() },
      { new: true }
    ).lean();
  },

  getProductImages: async (productId) => {
    return Product.find({ _id: new ObjectId(productId) }).select(
      "product_images"
    );
  },

  deleteImages: async (fileNames, productId) => {
    let response = await removeFiles(fileNames, `productImage/${productId}`);
    if (response.success === true) {
      return response.images;
    } else {
      error.status = "BAD_REQUEST";
      error.message = response?.message;
      error.data = null;
      throw error;
    }
    return [];
  },

  saveImages: async (files, productId) => {
    const productImages = files ? files : null;
    if (productImages) {
      let response = await uploadImages(
        productImages,
        `productImage/${productId}`
      );
      if (response.success === true) {
        return response.images;
      } else {
        error.status = "BAD_REQUEST";
        error.message = response?.message;
        error.data = null;
        throw error;
      }
    } else {
      return [];
    }
  },

  deleteAllProductImages: async (productId) => {
    return await removeAllFiles(`productImage/${productId}`);
  },
};
module.exports = productService;

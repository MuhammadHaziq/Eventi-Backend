const productService = require("../../services/Product/productService");

module.exports = {
  addProduct: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const newProduct = await productService.addProduct(body);
      if (newProduct)
        return helper.apiResponse(
          res,
          false,
          "Product Created Successfully",
          newProduct
        );
      return helper.apiResponse(
        res,
        true,
        "Product Not Created Successfully",
        null
      );
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getProducts: async (req, res) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req.query,
        authAccount: req.account_id,
      };
      const products = await productService.getProducts(body);
      if (products && products?.data?.length > 0)
        return helper.apiResponse(
          res,
          false,
          "Products Fetch Successfully",
          products
        );
      return helper.apiResponse(res, true, "No Products Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  getProduct: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const product = await productService.getProduct(body);
      if (product)
        return helper.apiResponse(
          res,
          false,
          "Product Fetch Successfully",
          product
        );
      return helper.apiResponse(res, true, "No Product Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const updatedProduct = await productService.updateProduct(body);
      if (updatedProduct)
        return helper.apiResponse(
          res,
          false,
          "Product Updated Successfully",
          updatedProduct
        );
      return helper.apiResponse(res, true, "No Product Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const body = { ...req.body, ...req.params, authAccount: req.account_id };
      const deletedProduct = await productService.deleteProduct(body);
      if (deletedProduct)
        return helper.apiResponse(
          res,
          false,
          "Product Deleted Successfully",
          deletedProduct
        );
      return helper.apiResponse(res, true, "No Product Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },
};

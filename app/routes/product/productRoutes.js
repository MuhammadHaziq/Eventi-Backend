var express = require("express");
var router = express.Router();
const productController = require("../../controllers/product/productController");
const authMiddleware = require("../../middleware/authMiddleware");

router.route("/").post(authMiddleware, productController.addProduct);
router.route("/").get(authMiddleware, productController.getProducts);
router.route("/:product_id").get(authMiddleware, productController.getProduct);
router.route("/").put(authMiddleware, productController.updateProduct);
router
  .route("/:product_id")
  .delete(authMiddleware, productController.deleteProduct);

module.exports = {
  router: router,
  basePath: "product",
};
 
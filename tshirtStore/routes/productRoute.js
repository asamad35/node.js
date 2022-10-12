const express = require("express");
const router = express.Router();

const { isLoggedIn, customRole } = require("../middlewares/user");

const {
  addProduct,
  getAllProducts,
  adminGetAllProducts,
  getSingleProduct,
  adminUpdateOneProduct,
} = require("../controllers/productController");

// user routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getSingleProduct);

// admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProducts);

router
  .route("/admin/product/update/:id")
  .post(isLoggedIn, customRole("admin"), adminUpdateOneProduct);

module.exports = router;

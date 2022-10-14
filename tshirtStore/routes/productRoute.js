const express = require("express");
const router = express.Router();

const { isLoggedIn, customRole } = require("../middlewares/user");

const {
  addProduct,
  getAllProducts,
  adminGetAllProducts,
  getSingleProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addUpdateReview,
  deleteReview,
} = require("../controllers/productController");

// user routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/product/add-review").put(isLoggedIn, addUpdateReview);
router.route("/product/delete-review").delete(isLoggedIn, deleteReview);

// admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProducts);

router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOneProduct)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct);

module.exports = router;

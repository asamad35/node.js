const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  getAdminAllOrders,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controllers/orderController");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);

router.route("/myorders").get(isLoggedIn, getLoggedInOrders);

// admin routes
router
  .route("/admin/allorders")
  .get(isLoggedIn, customRole("admin"), getAdminAllOrders);

router
  .route("/admin/updateOrder/:id")
  .post(isLoggedIn, customRole("admin"), adminUpdateOrder)
  .put(isLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;

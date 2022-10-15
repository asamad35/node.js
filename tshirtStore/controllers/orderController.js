const Order = require("../models/order");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Product = require("../models/product");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    user,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    user,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getOneOrder = BigPromise(async (req, res, next) => {
  // populate add ref schema properties
  const order = await Order.findById(req.params.id).populate("user", "name");

  if (!order) {
    return next(CustomError("No order found", 400));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getLoggedInOrders = BigPromise(async (req, res, next) => {
  // populate add ref schema properties
  const orders = await Order.find({ use: req.user._id });

  if (!orders) {
    return next(CustomError("No order found", 400));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getAdminAllOrders = BigPromise(async (req, res, next) => {
  // populate add ref schema properties
  const orders = await Order.find();

  if (!orders) {
    return next(CustomError("No order found", 400));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.adminUpdateOrder = BigPromise(async (req, res, next) => {
  // populate add ref schema properties
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(CustomError("No order found", 400));
  }

  if (order.orderStatus === "Delivered") {
    return next(CustomError("Order is marked ad delivered", 400));
  }

  order.orderStatus = orderStatus;
  // updating stock
  for (let i = 0; order.orderItems.length; i++) {
    await updateProductStock(
      order.orderItems[i].product,
      order.orderItems[i].quantity
    );
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
  // populate add ref schema properties
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(CustomError("No order found", 400));
  }
  await order.remove();

  res.status(200).json({
    success: true,
    order,
  });
});

async function updateProductStock(productID, quantity) {
  const product = await Product.findById(productID);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

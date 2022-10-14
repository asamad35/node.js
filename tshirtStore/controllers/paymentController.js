const BigPromise = require("../middlewares/bigPromise");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

exports.sendStripeKey = BigPromise(async (req, res, next) => {
  res.json({
    key: process.env.STRIPE_API_KEY,
  });
});

exports.captureStripePayment = BigPromise(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",

    // optional
    metaData: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    succes: true,
    client_secret: paymentIntent.client_secret,
  });
});

exports.sendRazorpayKey = BigPromise(async (req, res, next) => {
  res.json({
    key: process.env.RAZORPAY_API_KEY,
  });
});

exports.captureRazorpayPayment = BigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  const options = {
    amount: req.body.amount,
    currency: "INR",
  };
  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order: myOrder,
    amount: req.body.amount,
  });
});

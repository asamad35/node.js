const express = require("express");
const Razorpay = require("razorpay");
const app = express();

app.use(express.json());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/order", async (req, res) => {
  try {
    const amount = req.body.amount;
    var instance = new Razorpay({
      key_id: "rzp_live_MFwxfsJfg7IKN1",
      key_secret: "LMK2YhijArDNhG3i7O3pTMsj",
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        key1: "value3",
        key2: "value2",
      },
    };

    const myOrder = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      amount,
      order: myOrder,
    });
  } catch (error) {
    console.log(error, "llllllllll");
  }
});

app.listen(4000, () => console.log("server is running at port 4000"));

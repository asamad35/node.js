const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/passport", () =>
  console.log("DB got connected")
);

app.set("view engine", "ejs");
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(4000, () => {
  console.log("server is running at port 4000");
});

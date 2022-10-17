const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const passportConfig = require("./passport/passport");
const passport = require("passport");
var cookieSession = require("cookie-session");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/passport", () =>
  console.log("DB got connected")
);

app.use(
  cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: ["thisislcotokenkey"], // dotenv
  })
);

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  }
  next();
};

app.set("view engine", "ejs");
app.use("/auth", authRoute);

app.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});

app.listen(4000, () => {
  console.log("server is running at port 4000");
});

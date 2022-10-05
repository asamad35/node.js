const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return next(new CustomError("Fields are required", 700));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  cookieToken(user, res);
});

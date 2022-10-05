const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");

exports.signup = BigPromise(async (req, res, next) => {
  let result;

  if (!req.files) {
    return next(new CustomError("photo is a required field", 700));
  }
  if (!email || !password || !name) {
    return next(new CustomError("Fields are required", 700));
  }

  if (req.files) {
    let file = req.files.photo;

    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      securedUrl: result.secure_url,
    },
  });
  cookieToken(user, res);
});

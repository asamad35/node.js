const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const emailHelper = require("../utils/emailHelper");

exports.signup = BigPromise(async (req, res, next) => {
  let result;

  if (!req.files) {
    return next(new CustomError("photo is a required field", 700));
  }

  const { name, email, password } = req.body;

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

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    return next(new CustomError("Email and password are required fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("User not found, please signup", 400));
  }

  const isPasswordCorrect = user.isPasswordValid(password);
  if (!isPasswordCorrect) {
    return next(new CustomError("Password is incorrect", 400));
  }

  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: "Logout success",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("Email not registered", 400));
  }

  const forgotPasswordToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${forgotPasswordToken}`;

  const message = `copy this link in url and hit enter  \n\n ${myUrl}`;

  try {
    console.log("eeeeeee");
    await emailHelper({
      email: user.email,
      subject: "Tshirt store - Password reset email",
      message,
    });
    res.status(200).json({
      success: true,
      message: "email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error, "eeeeeee");
    return next(new CustomError("hello", 500));
  }
});

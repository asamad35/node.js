const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const emailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

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

  const isPasswordCorrect = await user.isPasswordValid(password);
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
  )}/api/v1/password/reset/${forgotPasswordToken}`;

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

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: encryptedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password does not match", 400)
    );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  // sending token to frontend if reset is successfull
  cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const { oldPass, newPass, confirmNewPass } = req.body;

  // user
  const user = await User.findById(req.user.id).select("+password");

  // validating old password
  const isPasswordCorrect = await user.isPasswordValid(oldPass);
  console.log(
    user,
    oldPass,
    newPass,
    confirmNewPass,
    isPasswordCorrect,
    "llllllllllll"
  );

  if (!isPasswordCorrect) {
    return next(new CustomError("Incorrect old password", 400));
  }

  if (newPass !== confirmNewPass) {
    return next(new CustomError("New password does not match", 400));
  }

  user.password = newPass;
  await user.save({ validateBeforeSave: false });
  cookieToken(user, res);
  res.status(200).json({
    success: true,
    message: "Password has baeen updated successfully",
  });
});

exports.updateUserProfile = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if there is photo in req payload
  if (req.files) {
    const user = await User.findById(req.user.id);

    // delete cloudinary photo
    const photoId = user.photo.id;
    await cloudinary.v2.uploader.destroy(photoId);

    // add new photo to cloudinary
    const file = req.files.photo;

    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    succes: true,
    user,
  });
});

exports.adminUpdateOneUser = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user.photo) {
    await cloudinary.v2.uploader.destroy(user.photo.id);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.managerAllUser = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
});

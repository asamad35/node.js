const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is a required field"],
    maxlength: [40, "Name should be under 40 characters"],
  },

  email: {
    type: String,
    require: [true, "Email is a required field"],
    validate: [validator.isEmail, "Enter correct email"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is a required field"],
    minlength: [6, "Password should be atleast 6 characters long"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    securedUrl: {
      type: String,
      required: true,
    },
  },
  forgetPasswordToken: String,
  forgetPasswordDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypt password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// validate password with user passed password
userSchema.methods.isPasswordValid = async (userEnteredPassword) => {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

// adding jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// get forget password token (string)
userSchema.methods.getForgetPasswordToken = function () {
  // create a long and random string
  const forgetPassword = crypto.randomBytes(20).toString("hex");

  // getting hash, make sure to hash on backend (extra layer of protection) (optional)
  this.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(forgetPassword)
    .digest("hex");

  // time of token
  this.forgetPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgetPassword;
};

module.exports = mongoose.model("User", userSchema);

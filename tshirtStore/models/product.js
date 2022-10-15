const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Product name is a required field"],
    trim: true,
    maxLength: [120, "Product name should be not more than 120 characters"],
  },
  price: {
    type: Number,
    require: [true, "Product price is a required field"],
    maxLength: [5, "Product price should be not more than 5 digits"],
  },
  description: {
    type: String,
    require: [true, "Product description is a required field"],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    require: [
      true,
      "Please select categories from short-sleeves, long-sleeves, sweet-shirts, hoodies",
    ],
    enum: {
      values: ["shortsleeves", "longsleeves", "sweetshirts", "hoodies"],
      message:
        "Please select category only from  short-sleeves, long-sleeves, sweet-shirts, hoodies",
    },
  },
  stock: {
    type: Number,
    required: [true, "please add stock"],
  },

  brand: {
    type: String,
    required: [true, "please add a brand for clothing"],
  },

  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        require: true,
      },
      feedback: {
        type: Number,
        require: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);

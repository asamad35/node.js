const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;

exports.addProduct = BigPromise(async (req, res, next) => {
  let photosArr = [];

  if (!req.files) {
    return next(new CustomError("images are required", 401));
  }

  if (req.files) {
    const photos = req.files.photos;

    // if there is only 1 photo then "photos" will be array
    if (Array.isArray(photos)) {
      for (let i = 0; i < photos.length; i++) {
        const singlePhotoObj = await cloudinary.uploader.upload(
          photos[i].tempFilePath,
          {
            folder: "product",
          }
        );
        photosArr.push({
          id: singlePhotoObj.public_id,
          secure_url: singlePhotoObj.secure_url,
        });
      }
    } else {
      // wont be array because only one object is here
      const singlePhotoObj = await cloudinary.uploader.upload(
        photos[i].tempFilePath,
        {
          folder: "product",
        }
      );
      photosArr.push({
        id: singlePhotoObj.public_id,
        secure_url: singlePhotoObj.secure_url,
      });
    }
  }

  req.body.photos = photosArr;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  console.log(req.user.id, "req.user.id", product);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProducts = BigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalProductCounts = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;
  productsObj.pager(resultPerPage);

  // calling again paginated result
  products = await productsObj.base.clone();

  const filterProductNumber = products.length;

  res.status(200).json({
    success: true,
    products,
    filterProductNumber,
    totalProductCounts,
  });
});

exports.getSingleProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
  const productID = req.params.id;

  let product = await Product.findById(productID);
  console.log(product, "product", req.files, req.body);
  if (!product) {
    return next(new CustomError("Product not found", 400));
  }

  const photosArr = [];
  const photos = req.files.photos;

  // updating photos
  if (photos) {
    // deleting
    for (let i = 0; i < product.photos.length; i++) {
      await cloudinary.uploader.destroy(product.photos[i].id);
    }

    // adding
    // if there is only 1 photo then "photos" will be array
    if (Array.isArray(photos)) {
      for (let i = 0; i < photos.length; i++) {
        const singlePhotoObj = await cloudinary.uploader.upload(
          photos[i].tempFilePath,
          {
            folder: "product",
          }
        );
        photosArr.push({
          id: singlePhotoObj.public_id,
          secure_url: singlePhotoObj.secure_url,
        });
      }
    } else {
      // wont be array because only one object is here
      const singlePhotoObj = await cloudinary.uploader.upload(
        photos.tempFilePath,
        {
          folder: "product",
        }
      );
      photosArr.push({
        id: singlePhotoObj.public_id,
        secure_url: singlePhotoObj.secure_url,
      });
    }
  }

  // updating other details
  product = await Product.findByIdAndUpdate(
    productID,
    { ...req.body, photos: photosArr },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
  const productID = req.params.id;

  let product = await Product.findById(productID);

  if (!product) {
    return next(new CustomError("Product not found", 400));
  }
  // deleting photos
  for (let i = 0; i < product.photos.length; i++) {
    await cloudinary.uploader.destroy(product.photos[i].id);
  }
  product = await Product.findByIdAndDelete(productID);

  res.status(200).json({
    success: true,
    product,
  });
});

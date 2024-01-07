const Product = require("../models/product.model");
const { validationResult } = require("express-validator");
const { SUCCESS, FAILD, ERROR } = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");

const getAllProducts = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 30;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const products = await Product.find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: SUCCESS, data: { products } });
});

const getSingleProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    const error = appError.create("not found product", 404, ERROR);
    return next(error);
  }
  return res.json({ status: SUCCESS, data: { product } });
});

const createProduct = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, FAILD);
    return next(error);
  }
  const newProduct = new Product(req.body);

  await newProduct.save();

  res.status(201).json({ status: SUCCESS, data: { product: newProduct } });
});

const updateProduct = asyncWrapper(async (req, res) => {
  const productId = +req.params.productId;
  const updatedProduct = await Product.updateOne(
    { _id: productId },
    { $set: { ...req.body } }
  );
  return res
    .status(200)
    .json({ status: SUCCESS, data: { product: updatedProduct } });
});

const deleteProduct = async (req, res) => {
  await Product.deleteOne({ _id: req.params.productId });
  res.status(200).json({ status: SUCCESS, data: null });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

import catchAsyncErrors from "../middleWares/catchAsyncErrors.js";
import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

//   1 .create   product =>  /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 8;
  const apiFilters = new APIFilters(Product, req.query).search().filters();
  //console.log("req?.user",req?.user);

  let products = await apiFilters.query;
  let filteredProductCount = products.length;

  //return next(new ErrorHandler('hello potta nerakk', 400))  coming from frntend mine
  // return next(new ErrorHandler('ayi', 400))            ,,        ,,
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({
    resPerPage,
    filteredProductCount,
    products,
  });
});

// Create new product =>  /api/v1/admin/products

export const newProduct = async (req, res) => {
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(200).json({
    product,
  });
};

// Get single product details =>  /api/v1/admin/products/:id

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  res.status(200).json({
    product,
  });
});

// Update product details =>  /api/v1/admin/products/:id

export const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });
  res.status(200).json({
    product,
  });
});

// Delete product  =>  /api/v1/admin/products/:id

export const deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  await product.deleteOne();
  res.status(200).json({
    message: "product deleted",
  });
});

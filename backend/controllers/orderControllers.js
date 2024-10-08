import catchAsyncErrors from "../middleWares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

// create new Order  => /api/v1/orders/new

export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    itemsPrice,
    paymentMethod,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    paymentMethod,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });
  res.status(200).json({
    order,
  });
});

// get current user order Details => /api/v1/me/orders

export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

// get  Order  Details => /api/v1/order/:id

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("no Order found with this ID ", 404));
  }

  res.status(200).json({
    order,
  });
});

// get all orders -ADMIN  => /api/v1/admin/orders

export const allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    orders,
  });
});

// update orders -ADMIN  => /api/v1/admin/orders/:id

export const updateOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("no Order found with this ID ", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You have already delivered this order ", 400)
    );
  }

  // Update product stock

  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      return next(new ErrorHandler("No product found with this ID", 404));
    }
    product.stock = product?.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});

// delete  Order   => /api/v1/admin/order/:id

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("no Order found with this ID ", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

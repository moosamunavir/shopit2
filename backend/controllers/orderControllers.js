import catchAsyncErrors from "../middleWares/catchAsyncErrors.js";
import Order from "../models/order.js";

// create new Order  => /api/v1/order/new

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
  const order = await Order.find({ user: req.user._id });

  res.status(200).json({
    order,
  });
});

// get  Order  Details => /api/v1/order/:id

export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    // not finished ------------------------------------------------------
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("no Order found with this ID ", 404));
  }

  res.status(200).json({
    order,
  });
});

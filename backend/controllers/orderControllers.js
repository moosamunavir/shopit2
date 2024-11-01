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
  const order = await Order.findById(req.params.id).populate(
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

  let productNotFount = false;

  // Update product stock

  for (const item of order.orderItems) {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      productNotFount = true;
      break;
    }
    product.stock = product?.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  if (productNotFount) {
    return next(
      new ErrorHandler("No product found with one or more IDs", 404)
    );
  }
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

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      // stage 1 - filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      // stage 2- group Data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 }, // count the number of orders
      },
    },
  ]);

  //console.log(salesData);

  // Create a Map to store sales data and num of order by date

  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  // Generate an array of dates between start & end Date
  const datesBetween = getDatesBetween(startDate, endDate);
  // console.log(datesBetween);

  // Create final sales data array with 0 for dates without sales
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));
  //console.log(finalSalesData);

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

// ganarate an array of dates between start & end Date

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const forMattedDate = currentDate.toISOString().split("T")[0];
    dates.push(forMattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// get sales data   => /api/v1/admin/get_sales

export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const { salesData, totalSales, totalNumOrders } = await getSalesData(
    startDate,
    endDate
  );

  res.status(200).json({
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});

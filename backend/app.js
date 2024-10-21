import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middleWares/error.js";

// handle uncaught excemptions errors

process.on("uncaugthExcemption", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to uncaught excemption");
  process.exit(1);
});

dotenv.config({ path: `backend/config/config.env` });

// connecting to database

connectDatabase();

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(cookieParser());

// ************

// import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// Using Error middleware

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server started port : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle Unhanddled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});

import express from "express";
import { isAuthendicatedUser } from "../middleWares/auth.js";
import { getOrderDetails, myOrders, newOrder } from "../controllers/orderControllers.js";
const router = express.Router();




router.route("/order/new").post(isAuthendicatedUser, newOrder);
router.route("/order/:id").get(isAuthendicatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthendicatedUser, myOrders);



export default router;

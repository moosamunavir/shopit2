import express from "express";
import { authorizeRoles, isAuthendicatedUser } from "../middleWares/auth.js";
import {
  allOrders,
  deleteOrder,
  getOrderDetails,
  getSales,
  myOrders,
  newOrder,
  updateOrders,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.route("/orders/new").post(isAuthendicatedUser, newOrder);
router.route("/orders/:id").get(isAuthendicatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthendicatedUser, myOrders);

router
  .route("/admin/get_sales")
  .get(isAuthendicatedUser, authorizeRoles("admin"), getSales);
  
router
  .route("/admin/orders")
  .get(isAuthendicatedUser, authorizeRoles("admin"), allOrders);

router
  .route("/admin/orders/:id")
  .put(isAuthendicatedUser, authorizeRoles("admin"), updateOrders)
  .delete(isAuthendicatedUser, authorizeRoles("admin"), deleteOrder);

export default router;

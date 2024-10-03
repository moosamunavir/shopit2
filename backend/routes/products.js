import express from "express";
import {
  deleteProduct,
  getProductDetails,
  getProducts,
  newProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthendicatedUser } from "../middleWares/auth.js";
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductDetails);

router
  .route("/admin/products")
  .post(isAuthendicatedUser, authorizeRoles("admin"), newProduct);

router
  .route("/admin/products/:id")
  .put(isAuthendicatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/admin/products/:id")
  .delete(isAuthendicatedUser, authorizeRoles("admin"), deleteProduct);

export default router;

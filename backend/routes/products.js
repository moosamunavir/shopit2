import express from "express";
import {
  deleteProduct,
  getAdminProducts,
  getProductDetails,
  getProducts,
  newProduct,
  updateProduct,
  uploadProductImages,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthendicatedUser } from "../middleWares/auth.js";
const router = express.Router();

router.route("/products").get(getProducts);
router
  .route("/admin/products")
  .post(isAuthendicatedUser, authorizeRoles("admin"), newProduct)
  .get(isAuthendicatedUser, authorizeRoles("admin"), getAdminProducts);

router.route("/products/:id").get(getProductDetails);

router
  .route("/admin/products/:id/upload_images")
  .put(isAuthendicatedUser, authorizeRoles("admin"), uploadProductImages)

router
  .route("/admin/products/:id")
  .put(isAuthendicatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/admin/products/:id")
  .delete(isAuthendicatedUser, authorizeRoles("admin"), deleteProduct);

export default router;

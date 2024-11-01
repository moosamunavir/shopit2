import express from "express";
import {
  canUserReview,
  createProductReview,
  deleteProduct,
  deleteProductImage,
  deleteReview,
  getAdminProducts,
  getProductDetails,
  getProductRiviews,
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
  .put(isAuthendicatedUser, authorizeRoles("admin"), uploadProductImages);

router
  .route("/admin/products/:id/delete_images")
  .put(isAuthendicatedUser, authorizeRoles("admin"), deleteProductImage);

router
  .route("/admin/products/:id")
  .put(isAuthendicatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/admin/products/:id")
  .delete(isAuthendicatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .get(isAuthendicatedUser, getProductRiviews)
  .put(isAuthendicatedUser, createProductReview);

router
  .route("/admin/reviews")
  .delete(isAuthendicatedUser, authorizeRoles("admin"), deleteReview);

router.route("/can_review").get(isAuthendicatedUser, canUserReview);

export default router;

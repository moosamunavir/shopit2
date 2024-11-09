import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  delateUser,
  uploadAvatar,
} from "../controllers/authControllers.js";
import { authorizeRoles, isAuthendicatedUser } from "../middleWares/auth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthendicatedUser, getUserProfile);
router.route("/me/update").put(isAuthendicatedUser, updateProfile);
router.route("/password/update").put(isAuthendicatedUser, updatePassword);
router.route("/me/upload_avatar").put(isAuthendicatedUser, uploadAvatar);


router
  .route("/admin/users")
  .get(isAuthendicatedUser, authorizeRoles("admin"), allUsers);

router
  .route("/admin/users/:id")
  .get(isAuthendicatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthendicatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthendicatedUser, authorizeRoles("admin"), delateUser);

export default router;

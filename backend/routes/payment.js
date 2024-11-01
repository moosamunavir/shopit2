import express from "express";
const router = express.Router();

import { isAuthendicatedUser } from "../middleWares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
} from "../controllers/paymentControllers.js";

router
  .route("/payment/checkout_session")
  .post(isAuthendicatedUser, stripeCheckoutSession);


router.route("/payment/webhook").post( stripeWebhook);


export default router;



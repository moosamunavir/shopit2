import catchAsyncErrors from "../middleWares/catchAsyncErrors.js";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// create stripe checkOut session => /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const body = req?.body;
    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "aed",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: ["txr_1Q4D3JDWVJ38H7vpt0oXpd5t"],
        quantity: item?.quantity,
      };
    });
    const shippingInfo = body?.shippingInfo;
    const shipping_rate =
      body?.itemsPrice >= 100
        ? "shr_1Q4CntDWVJ38H7vpMnMerCwF"
        : "shr_1Q4Cp9DWVJ38H7vpE9Z93Vdw";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
      shipping_options: [{ shipping_rate }],
      line_items,
    });
    res.status(200).json({ url: session.url });
  }
);
// create new order after payment  => /api/v1/payment/webhook

export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session);
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("error => ", error);
  }
});

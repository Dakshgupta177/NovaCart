import Stripe from "stripe";
import { Payment } from "../models/payment.model.js";
import { Product } from "../models/product.model.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const makeOnePayment = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }
    const products = Array.isArray(product) ? product : [product];

    for (const item of products) {
      item.quantity = item.quantity || 1;

      const prod = await Product.findById(item._id);

      if (!prod) {
        return res.status(404).json({ message: `${item.name} not found` });
      }

      if (prod.items < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.name}` });
      }
    }
    const lineItems = products.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 8000 * 0.8),
      },
      quantity: item.quantity || 1,
    }));

    const payment = await Payment.create({
      userId: req.user._id,
      productDetails: products,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        paymentId: payment._id.toString(),
      },
    });

    payment.Oid = session.id;
    await payment.save();
    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "sessionID not provided" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const User = await Payment.findOne({ Oid: sessionId });

    User.created = session.created;
    User.amount = session.amount_subtotal;
    User.payment_status = session.payment_status;

    await User.save({ validateBeforeSave: false });

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error verifying payment",
    });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const Data = await Payment.find({ userId: req.user._id }).sort({
      created: -1,
    });
    if (!Data) {
      return res.status(400).json({ message: "Data not found" });
    }
    return res.status(200).json({ message: "successfull get the data", Data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in fetching order details failed" });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const paymentId = session.metadata.paymentId;
    const payment = await Payment.findById(paymentId);
    if (payment) {
      payment.payment_status = session.payment_status;
      payment.amount = session.amount_total;
      payment.created = session.created;

      await Promise.all(
        payment.productDetails.map((item) =>
          Product.findByIdAndUpdate(item._id, {
            $inc: {
              items: -(item.quantity || 1),
            },
          }),
        ),
      );

      await payment.save();
    }
  }

  res.sendStatus(200);
};

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit'
import { cronJob } from "./cron.js";
dotenv.config();

const limiter = rateLimit({
	windowMs: 30 * 1000,
	limit: 25,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
})

const app = express();
cronJob();

import stripeWebhookRouter from "./routes/webhook.route.js";
app.use("/webhook", stripeWebhookRouter);

app.get("/health", (req, res) => {
  console.log("Health");
  return res.status(200).json({
    message: "Server is working",
  });
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
// app.set("trust proxy", 1)
app.use(limiter);
app.use(express.json({ limit: "1mb" })); // increase limit as necessary
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import stripeRoute from "./routes/stripe.route.js";
import aiRoute from "./routes/ai.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import requestRoute from "./routes/request.route.js";

app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/stripe", stripeRoute);
app.use("/api/ai", aiRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/request", requestRoute);
export { app };

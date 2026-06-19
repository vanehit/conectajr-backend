import express from "express";
import { createOrder, paypalWebhook } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/create-order", authMiddleware, createOrder);

router.post("/paypal/webhook", paypalWebhook);

export default router;
import express from "express";
import { createOrder, paypalWebhook } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Crear orden (requiere usuario logueado)
router.post("/create-order", authMiddleware, createOrder);

// Webhook (NO lleva auth)
router.post("/paypal/webhook", paypalWebhook);

export default router;
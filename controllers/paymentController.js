import paypal from "@paypal/checkout-server-sdk";
import client from "../config/paypal.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();

    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // o ARS si tu cuenta lo permite
            value: amount,
          },
          custom_id: req.user.id, // 👈 CLAVE: guardamos userId
        },
      ],
    });

    const order = await client.execute(request);

    res.json({ id: order.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando orden" });
  }
};

export const paypalWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;

      const userId = capture.custom_id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      const now = new Date();

      const baseDate =
        user.premiumUntil && user.premiumUntil > now
          ? user.premiumUntil
          : now;

      baseDate.setDate(baseDate.getDate() + 30);

      user.premiumUntil = baseDate;
      await user.save();
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error webhook");
  }
};


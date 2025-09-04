import express from "express";
import Visit from "../models/Visit.js";

const router = express.Router();

// Endpoint para registrar una visita, opcionalmente con userId
router.post("/register", async (req, res) => {
  try {
    const { userId } = req.body; // esperamos que el frontend mande el userId si está logueado

    // Para evitar duplicados: 
    // Buscamos si el usuario ya registró una visita hoy
    if (userId) {
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);

      const existingVisit = await Visit.findOne({
        userId,
        timestamp: { $gte: todayStart }
      });

      if (existingVisit) {
        // Ya existe visita hoy para este usuario, no creamos otra
        const total = await Visit.countDocuments();
        return res.json({ message: "Visita ya registrada hoy", total });
      }
    }

    // Crear visita nueva
    const visit = new Visit({ userId });
    await visit.save();

    const total = await Visit.countDocuments();
    res.json({ message: "Visita registrada", total });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

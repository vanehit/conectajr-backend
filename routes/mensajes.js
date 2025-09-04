import express from "express";
import { crearMensaje, obtenerMensajes, responderMensaje } from "../controllers/mensajeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Crear mensaje público
router.post("/", crearMensaje);

// Obtener todos los mensajes (solo admin)
router.get("/", authMiddleware, obtenerMensajes);

// Responder a un mensaje (solo admin)
router.post("/:id/respuesta", authMiddleware, responderMensaje);

export default router;

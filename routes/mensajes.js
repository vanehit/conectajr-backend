import express from "express";
import { crearMensaje, obtenerMensajes, responderMensaje } from "../controllers/mensajeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Crear mensaje → usuarios logueados
router.post("/", authMiddleware, crearMensaje);

// Obtener mensajes → admin
router.get("/", authMiddleware, obtenerMensajes);

// Responder mensaje → admin
router.put("/:id/respuesta", authMiddleware, responderMensaje);

export default router;

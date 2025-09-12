import express from "express";
import { crearMensaje, obtenerMensajes, responderMensaje } from "../controllers/mensajeController.js";


const router = express.Router();

// Crear mensaje → usuarios logueados
router.post("/", crearMensaje);

// Obtener mensajes → admin
router.get("/", obtenerMensajes);

// Responder mensaje → admin
router.put("/:id/respuesta",responderMensaje);

export default router;

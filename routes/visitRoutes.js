import express from "express";
import { registerVisit, getTotalVisits } from "../controllers/visitController.js";

const router = express.Router();

router.post("/register", registerVisit);
router.get("/total", getTotalVisits); // ⚡ añadimos esta ruta para consultar totales

export default router;

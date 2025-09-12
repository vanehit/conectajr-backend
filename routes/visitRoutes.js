import express from "express";
import { registerVisit } from "../controllers/visitController.js";

const router = express.Router();

router.post("/register", registerVisit);

export default router;

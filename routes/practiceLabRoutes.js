import express from "express";
import { createPracticeLabSession } from "../controllers/practiceLabController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/sessions", authMiddleware, createPracticeLabSession);

export default router;

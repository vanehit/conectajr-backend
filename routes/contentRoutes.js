import express from "express";
import { getContents } from "../controllers/contentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getContents);

export default router;

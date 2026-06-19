import express from "express";
import { toggleLike } from "../controllers/likeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:contentId", authMiddleware, toggleLike);

export default router;
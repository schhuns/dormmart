import express from "express";
import { toggleFavorite, getMyFavorites } from "../controllers/favoriteController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getMyFavorites);
router.post("/toggle/:productId", authenticate, toggleFavorite);

export default router;

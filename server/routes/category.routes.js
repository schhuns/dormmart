import express from "express";
import { getCategories, createCategory, updateCategory } from "../controllers/categoryController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", authenticate, requireAdmin, createCategory);
router.patch("/:id", authenticate, requireAdmin, updateCategory);

export default router;

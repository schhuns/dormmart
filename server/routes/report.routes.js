import express from "express";
import { createReport } from "../controllers/reportController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, createReport);

export default router;

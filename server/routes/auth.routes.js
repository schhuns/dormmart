import express from "express";
import {
  emailRegister,
  emailLogin,
  googleSignIn,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", emailRegister);
router.post("/login", emailLogin);
router.post("/google", googleSignIn);
router.get("/me", authenticate, getMe);
router.patch("/profile", authenticate, updateProfile);

export default router;

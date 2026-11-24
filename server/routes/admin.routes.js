import express from "express";
import {
  getAdminStats,
  getAdminUsers,
  toggleUserStatus,
  moderateProduct,
  getAdminReports,
  updateReportStatus,
  getAdminLogs,
} from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.patch("/users/:id/status", toggleUserStatus);
router.patch("/products/:id/moderate", moderateProduct);
router.get("/reports", getAdminReports);
router.patch("/reports/:id", updateReportStatus);
router.get("/logs", getAdminLogs);

export default router;

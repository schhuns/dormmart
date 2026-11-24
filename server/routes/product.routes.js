import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getSellerContacts,
  getMyListings,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Public marketplace routes
router.get("/", optionalAuth, getProducts);
router.get("/user/me", authenticate, getMyListings);
router.get("/:id", optionalAuth, getProductById);

// Intentional "Contact Seller" modal endpoint (Section 5.5)
router.get("/:id/contact", getSellerContacts);

// Protected listing management
router.post("/", authenticate, upload.array("images", 2), createProduct);
router.patch("/:id", authenticate, upload.array("images", 2), updateProduct);
router.patch("/:id/status", authenticate, updateProductStatus);
router.delete("/:id", authenticate, deleteProduct);

export default router;

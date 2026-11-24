import mongoose from "mongoose";

/**
 * Product Schema — Master Prompt Section 11.2
 */
const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one product image is required",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be non-negative"],
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Acceptable"],
      required: [true, "Condition is required"],
    },
    pickupLocation: {
      type: String,
      default: "", // General meeting spot (e.g. "Near main entrance", "Building A lobby")
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Sold", "Hidden"],
      default: "Available",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index on title and description
productSchema.index({ title: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;

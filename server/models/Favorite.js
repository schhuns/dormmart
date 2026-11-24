import mongoose from "mongoose";

/**
 * Favorite Schema — Master Prompt Section 11.4
 */
const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate favorites per user
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;

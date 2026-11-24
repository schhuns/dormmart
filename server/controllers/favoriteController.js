import Favorite from "../models/Favorite.js";

/**
 * TOGGLE product favorite (add if not saved, remove if saved)
 * POST /api/favorites/toggle/:productId
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const existing = await Favorite.findOne({ userId, productId });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({
        favorited: false,
        message: "Removed from favorites",
      });
    } else {
      await Favorite.create({ userId, productId });
      return res.json({
        favorited: true,
        message: "Added to favorites",
      });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
};

/**
 * GET current user's saved favorites
 * GET /api/favorites
 */
export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: "productId",
        populate: [
          { path: "categoryId", select: "name" },
          { path: "sellerId", select: "fullName profileImage" },
        ],
      })
      .sort({ createdAt: -1 });

    // Filter out favorites whose products have been deleted
    const validProducts = favorites
      .filter((fav) => fav.productId != null)
      .map((fav) => fav.productId);

    res.json(validProducts);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

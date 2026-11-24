import "../config/env.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";

export const BLUEPRINT_CATEGORIES = [
  {
    name: "Books & Education",
    description: "Course textbooks, reference books, study guides, and educational materials",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Clothing & Shoes",
    description: "Everyday apparel, jackets, shoes, formal wear, and accessories",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Electronics & Accessories",
    description: "Chargers, power banks, computer peripherals, headphones, and desk electronics",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Stationery",
    description: "Notebooks, pens, organizers, desk stationery, and supplies",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Bags & Accessories",
    description: "Backpacks, tote bags, laptop cases, wallets, and travel gear",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Dorm Essentials",
    description: "Storage bins, desk lamps, hangers, organizers, mirrors, and room items",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Kitchen & Household Items",
    description: "Thermal bottles, electric kettles, mugs, containers, and permitted appliances",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Sports & Recreation",
    description: "Sport equipment, fitness gear, board games, and outdoor accessories",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    name: "Other Permitted Items",
    description: "Miscellaneous permitted everyday second-hand goods",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    isActive: true,
  },
];

/**
 * Ensures all 9 blueprint categories are present in the connected database
 */
export const ensureBlueprintCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count >= BLUEPRINT_CATEGORIES.length) {
      return;
    }

    console.log(`📦 Checking/seeding blueprint categories (Current: ${count}/${BLUEPRINT_CATEGORIES.length})...`);
    for (const cat of BLUEPRINT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        cat,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✅ All ${BLUEPRINT_CATEGORIES.length} blueprint categories confirmed in MongoDB!`);
  } catch (error) {
    console.error("⚠️ Error ensuring blueprint categories:", error.message);
  }
};

const runStandaloneSeed = async () => {
  try {
    const connString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dormmart";
    await mongoose.connect(connString);
    console.log("Connected to MongoDB for category seeding...");
    await ensureBlueprintCategories();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed categories:", error.message);
    process.exit(1);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith("seedCategories.js")) {
  runStandaloneSeed();
}

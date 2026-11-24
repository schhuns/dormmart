import Category from "../models/Category.js";
import Product from "../models/Product.js";
import AdminLog from "../models/AdminLog.js";
import { ensureBlueprintCategories } from "../seed/seedCategories.js";

/**
 * GET all active categories with available product count
 * GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Self-healing: auto-seed if database is currently empty
    if (categories.length === 0) {
      await ensureBlueprintCategories();
      categories = await Category.find({ isActive: true }).sort({ name: 1 });
    }

    // Safely aggregate counts of Available products
    let countMap = {};
    try {
      const counts = await Product.aggregate([
        { $match: { status: "Available" } },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      ]);
      counts.forEach((c) => {
        if (c._id) {
          countMap[c._id.toString()] = c.count;
        }
      });
    } catch (aggErr) {
      console.warn("Product count aggregation warning:", aggErr.message);
    }

    const result = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      availableCount: countMap[cat._id.toString()] || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

/**
 * ADMIN: Create category
 * POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      image: image || "",
      isActive: true,
    });

    await AdminLog.create({
      adminId: req.user._id,
      action: "CREATE_CATEGORY",
      targetType: "CATEGORY",
      targetId: category._id,
      details: `Created category: ${category.name}`,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

/**
 * ADMIN: Update category
 * PATCH /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();

    await AdminLog.create({
      adminId: req.user._id,
      action: "UPDATE_CATEGORY",
      targetType: "CATEGORY",
      targetId: category._id,
      details: `Updated category: ${category.name}`,
    });

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

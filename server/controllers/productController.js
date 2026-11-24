import Product from "../models/Product.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import { uploadImageToStorage } from "../config/cloudinary.js";

/**
 * CREATE a product listing with multi-image upload
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      condition,
      pickupLocation,
    } = req.body;

    if (!title || !description || price === undefined || !categoryId || !condition) {
      return res.status(400).json({
        error: "Title, description, price, categoryId, and condition are required",
      });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ error: "Price must be a valid positive number or 0" });
    }

    const category = await Category.findById(categoryId);
    if (!category || !category.isActive) {
      return res.status(400).json({ error: "Invalid or inactive category" });
    }

    // Process uploaded images
    let imageUrls = [];

    // From file upload (multipart/form-data)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImageToStorage(file.buffer, file.originalname);
        imageUrls.push(url);
      }
    }

    // Also support JSON image URLs
    if (imageUrls.length === 0 && req.body.images) {
      if (Array.isArray(req.body.images)) {
        imageUrls = req.body.images;
      } else if (typeof req.body.images === "string") {
        imageUrls = [req.body.images];
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ error: "At least one product image is required" });
    }

    const product = await Product.create({
      sellerId: req.user._id,
      categoryId,
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      condition,
      pickupLocation: pickupLocation ? pickupLocation.trim() : "",
      images: imageUrls,
      status: "Available",
    });

    await product.populate("categoryId", "name image");

    res.status(201).json({
      message: "Listing published successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create listing: " + error.message });
  }
};

/**
 * GET marketplace listings with search, category, condition, price & location filters
 * GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      location,
      status = "Available",
      sort = "newest",
      page = 1,
      limit = 24,
    } = req.query;

    const query = {};

    // By default, only show Available products
    if (status) {
      query.status = status;
    }

    // Category filter
    if (category) {
      query.categoryId = category;
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Keyword search (title & description)
    if (search && search.trim()) {
      const keyword = search.trim();
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Pickup location filter
    if (location && location.trim()) {
      query.pickupLocation = { $regex: location.trim(), $options: "i" };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Sort order
    let sortOptions = { createdAt: -1 }; // newest
    if (sort === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price_desc") {
      sortOptions = { price: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate("categoryId", "name image")
        .populate("sellerId", "fullName profileImage role createdAt")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch marketplace listings" });
  }
};

/**
 * GET product details by ID (never leaks private seller contacts or email)
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name image")
      .populate("sellerId", "fullName profileImage createdAt");

    if (!product || (product.status === "Hidden" && (!req.user || req.user._id.toString() !== product.sellerId._id.toString() && req.user.role !== "ADMIN"))) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
};

/**
 * CONTACT SELLER (Section 5.5)
 * Only reveals seller's external contact channels when intentionally selected
 * GET /api/products/:id/contact
 */
export const getSellerContacts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("sellerId");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const seller = product.sellerId;
    if (!seller || seller.accountStatus === "SUSPENDED") {
      return res.status(404).json({ error: "Seller is no longer active" });
    }

    // Format external links properly
    const rawContacts = seller.contacts || {};
    const formattedContacts = [];

    if (rawContacts.zalo) {
      formattedContacts.push({
        platform: "Zalo",
        value: rawContacts.zalo,
        link: `https://zalo.me/${rawContacts.zalo.replace(/\s+/g, "")}`,
      });
    }

    if (rawContacts.telegram) {
      const cleanTg = rawContacts.telegram.replace("@", "").trim();
      formattedContacts.push({
        platform: "Telegram",
        value: `@${cleanTg}`,
        link: `https://t.me/${cleanTg}`,
      });
    }

    if (rawContacts.messenger) {
      const link = rawContacts.messenger.startsWith("http")
        ? rawContacts.messenger
        : `https://m.me/${rawContacts.messenger}`;
      formattedContacts.push({
        platform: "Messenger",
        value: "Chat on Messenger",
        link,
      });
    }

    if (rawContacts.phone) {
      formattedContacts.push({
        platform: "Phone / SMS",
        value: rawContacts.phone,
        link: `tel:${rawContacts.phone.replace(/\s+/g, "")}`,
      });
    }

    res.json({
      sellerName: seller.fullName,
      sellerAvatar: seller.profileImage,
      productTitle: product.title,
      productPrice: product.price,
      pickupLocation: product.pickupLocation,
      contacts: formattedContacts,
    });
  } catch (error) {
    console.error("Contact seller error:", error);
    res.status(500).json({ error: "Failed to load seller contact information" });
  }
};

/**
 * GET current user's own listings
 * GET /api/products/user/me
 */
export const getMyListings = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get my listings error:", error);
    res.status(500).json({ error: "Failed to fetch your listings" });
  }
};

/**
 * UPDATE product details
 * PATCH /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Ownership check: seller or admin
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to edit this listing" });
    }

    const { title, description, price, categoryId, condition, pickupLocation } = req.body;

    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({ error: "Price must be a valid positive number or 0" });
      }
      product.price = numPrice;
    }
    if (categoryId !== undefined) product.categoryId = categoryId;
    if (condition !== undefined) product.condition = condition;
    if (pickupLocation !== undefined) product.pickupLocation = pickupLocation.trim();

    // Process retained images and newly uploaded images
    let updatedImages = [];
    if (req.body.existingImages) {
      try {
        const parsed = typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
        if (Array.isArray(parsed)) {
          updatedImages = parsed.filter(Boolean);
        } else if (typeof parsed === "string") {
          updatedImages = [parsed];
        }
      } catch (e) {
        if (typeof req.body.existingImages === "string" && req.body.existingImages.trim()) {
          updatedImages = [req.body.existingImages.trim()];
        }
      }
    } else if (!req.files || req.files.length === 0) {
      // If neither existingImages nor new files provided, keep existing images
      updatedImages = product.images;
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImageToStorage(file.buffer, file.originalname);
        updatedImages.push(url);
      }
    }

    if (updatedImages.length > 0) {
      product.images = updatedImages.slice(0, 5); // Max 5 images
    }

    await product.save();
    await product.populate("categoryId", "name image");

    res.json({
      message: "Listing updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

/**
 * CHANGE listing status (Available, Reserved, Sold, Hidden)
 * PATCH /api/products/:id/status
 */
export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Available", "Reserved", "Sold", "Hidden"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to change this listing's status" });
    }

    product.status = status;
    await product.save();

    res.json({
      message: `Product status changed to ${status}`,
      product,
    });
  } catch (error) {
    console.error("Update product status error:", error);
    res.status(500).json({ error: "Failed to update product status" });
  }
};

/**
 * DELETE product listing
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to delete this listing" });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};

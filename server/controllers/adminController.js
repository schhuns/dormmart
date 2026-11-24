import User from "../models/User.js";
import Product from "../models/Product.js";
import Report from "../models/Report.js";
import AdminLog from "../models/AdminLog.js";

/**
 * ADMIN: Overview statistics (Section 10.1)
 * GET /api/admin/stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalListings,
      availableListings,
      soldListings,
      pendingReports,
      suspendedUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ status: "Available" }),
      Product.countDocuments({ status: "Sold" }),
      Report.countDocuments({ status: "Pending" }),
      User.countDocuments({ accountStatus: "SUSPENDED" }),
    ]);

    res.json({
      totalUsers,
      totalListings,
      availableListings,
      soldListings,
      pendingReports,
      suspendedUsers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};

/**
 * ADMIN: User management
 * GET /api/admin/users
 */
export const getAdminUsers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (status) query.accountStatus = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(users);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * ADMIN: Suspend or reactivate user
 * PATCH /api/admin/users/:id/status
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["ACTIVE", "SUSPENDED"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'ACTIVE' or 'SUSPENDED'" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.accountStatus = status;
    await user.save();

    await AdminLog.create({
      adminId: req.user._id,
      action: status === "SUSPENDED" ? "SUSPEND_USER" : "REACTIVATE_USER",
      targetType: "USER",
      targetId: user._id,
      details: `${status} user: ${user.fullName} (${user.email})`,
    });

    res.json({ message: `User status changed to ${status}`, user });
  } catch (error) {
    console.error("Admin toggle status error:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
};

/**
 * ADMIN: Moderate / Remove product listing
 * PATCH /api/admin/products/:id/moderate
 */
export const moderateProduct = async (req, res) => {
  try {
    const { status, action } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (action === "DELETE") {
      await Product.findByIdAndDelete(req.params.id);
      await AdminLog.create({
        adminId: req.user._id,
        action: "REMOVE_PRODUCT",
        targetType: "PRODUCT",
        targetId: product._id,
        details: `Deleted listing: ${product.title}`,
      });
      return res.json({ message: "Listing permanently removed by admin" });
    }

    if (status) {
      product.status = status;
      await product.save();
      await AdminLog.create({
        adminId: req.user._id,
        action: "MODERATE_PRODUCT_STATUS",
        targetType: "PRODUCT",
        targetId: product._id,
        details: `Set listing status to ${status}: ${product.title}`,
      });
    }

    res.json({ message: "Product moderation applied", product });
  } catch (error) {
    console.error("Admin moderate product error:", error);
    res.status(500).json({ error: "Failed to moderate listing" });
  }
};

/**
 * ADMIN: Report queue & resolution
 * GET /api/admin/reports
 */
export const getAdminReports = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const reports = await Report.find(query)
      .populate("reporterId", "fullName email")
      .populate("reportedUserId", "fullName email")
      .populate("productId", "title price status")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error("Admin reports error:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

/**
 * ADMIN: Update report status
 * PATCH /api/admin/reports/:id
 */
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Under Review", "Resolved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid report status" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = status;
    await report.save();

    await AdminLog.create({
      adminId: req.user._id,
      action: "PROCESS_REPORT",
      targetType: "REPORT",
      targetId: report._id,
      details: `Marked report as ${status}`,
    });

    res.json({ message: `Report marked as ${status}`, report });
  } catch (error) {
    console.error("Update report status error:", error);
    res.status(500).json({ error: "Failed to update report status" });
  }
};

/**
 * ADMIN: Audit logs
 * GET /api/admin/logs
 */
export const getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("adminId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    console.error("Admin logs error:", error);
    res.status(500).json({ error: "Failed to fetch admin logs" });
  }
};

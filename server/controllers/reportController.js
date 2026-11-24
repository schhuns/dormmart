import Report from "../models/Report.js";

/**
 * SUBMIT a report against a product or user
 * POST /api/reports
 */
export const createReport = async (req, res) => {
  try {
    const { productId, reportedUserId, reason, description } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "Reason for report is required" });
    }

    if (!productId && !reportedUserId) {
      return res.status(400).json({ error: "Must specify a product or user to report" });
    }

    const report = await Report.create({
      reporterId: req.user._id,
      productId: productId || null,
      reportedUserId: reportedUserId || null,
      reason: reason.trim(),
      description: description ? description.trim() : "",
      status: "Pending",
    });

    res.status(201).json({
      message: "Report submitted to administrators for review",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

import mongoose from "mongoose";

/**
 * AdminLog Schema — Master Prompt Section 11.6
 */
const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true, // e.g. "SUSPEND_USER", "REMOVE_PRODUCT", "RESOLVE_REPORT"
    },
    targetType: {
      type: String,
      required: true, // "USER", "PRODUCT", "CATEGORY", "REPORT"
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;

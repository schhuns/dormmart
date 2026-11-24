import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { formatVND } from "../utils/formatters";
import { useLanguage } from "../context/LanguageContext";
import {
  Tag,
  Eye,
  Trash2,
  PlusCircle,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Edit3,
} from "lucide-react";

const STATUS_OPTIONS = ["Available", "Reserved", "Sold", "Hidden"];

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, translateCategory, translateCondition } = useLanguage();

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/user/me");
      setListings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch my listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await api.patch(`/products/${productId}/status`, { status: newStatus });
      setListings((prev) =>
        prev.map((item) => (item._id === productId ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/products/${productId}`);
      setListings((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  const getStatusLabel = (st) => {
    if (st === "Available") return t("statusAvailable");
    if (st === "Reserved") return t("statusReserved");
    if (st === "Sold") return t("statusSold");
    if (st === "Hidden") return t("statusHidden");
    return st;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("myListingsTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            {t("myListingsSubtitle")}
          </p>
        </div>

        <Link
          to="/sell"
          className="inline-flex items-center justify-center gap-2 bg-brand-navy dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>{t("sellItem")}</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading your listings...</p>
        </div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              {/* Product Thumbnail & Title */}
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <img
                  src={item.images?.[0] || "/uploads/placeholder.jpg"}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item._id}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-brand-blue dark:hover:text-brand-light text-sm sm:text-base line-clamp-1 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatVND(item.price, { freeText: t("freeGiveaway") })}
                    </span>
                    <span>•</span>
                    <span>{translateCondition(item.condition)}</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">
                      {translateCategory(item.categoryId?.name) || "General"}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                    {t("listedOn")} {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status Switcher & Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                {/* Status Switcher */}
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                    item.status === "Available"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : item.status === "Reserved"
                      ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      : item.status === "Sold"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {getStatusLabel(st)}
                    </option>
                  ))}
                </select>

                <Link
                  to={`/sell?edit=${item._id}`}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-light hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title={t("editListing")}
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <Link
                  to={`/products/${item._id}`}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-light hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  title="View listing"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base">{t("noListingsSelf")}</p>
          <Link
            to="/sell"
            className="inline-flex items-center gap-2 bg-brand-navy dark:bg-brand-blue text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            {t("listFirstItem")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyListings;

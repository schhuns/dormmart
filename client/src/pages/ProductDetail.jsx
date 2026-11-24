import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import ContactModal from "../components/ContactModal";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { formatVND } from "../utils/formatters";
import {
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Flag,
  Share2,
  Edit3,
} from "lucide-react";

const conditionColors = {
  New: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "Like New": "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  Good: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Acceptable: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

const ProductDetail = () => {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const { t, translateCategory, translateCondition } = useLanguage();

  const [product, setProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Fetch product detail error:", err);
        setError("Listing not found or has been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please sign in to submit a report.");
      return;
    }
    if (!reportReason) return;

    try {
      await api.post("/reports", {
        productId: product._id,
        reason: reportReason,
        description: reportDescription,
      });
      setReportSent(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSent(false);
      }, 2000);
    } catch (err) {
      alert("Failed to send report. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <p className="text-slate-800 dark:text-slate-200 font-semibold">{error || "Product not found"}</p>
        <Link
          to="/marketplace"
          className="inline-block bg-brand-navy dark:bg-brand-blue text-white text-xs font-semibold px-5 py-2.5 rounded-full"
        >
          {t("marketplace")}
        </Link>
      </div>
    );
  }

  const isOwner = user && user._id === product.sellerId?._id;
  const favorited = isFavorite(product._id);
  const images = product.images && product.images.length > 0 ? product.images : ["/uploads/placeholder.jpg"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-slate-700 dark:hover:text-slate-200">{t("home")}</Link>
        <span>/</span>
        <Link to="/marketplace" className="hover:text-slate-700 dark:hover:text-slate-200">{t("marketplace")}</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 lg:p-10 shadow-sm mb-16 md:mb-0">
        {/* Left Column: Image Carousel / Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <img
              src={images[activeImageIdx]}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Status overlay if not Available */}
            {product.status !== "Available" && (
              <div className="absolute top-4 left-4">
                <span className="bg-slate-900 text-white text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-md">
                  {product.status === "Reserved"
                    ? t("statusReserved")
                    : product.status === "Sold"
                    ? t("statusSold")
                    : t("statusHidden")}
                </span>
              </div>
            )}

            {/* Prev / Next buttons if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIdx === idx
                      ? "border-brand-blue shadow-md scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="flex flex-col space-y-5 sm:space-y-6">
          {/* Top meta tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                  conditionColors[product.condition] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {translateCondition(product.condition)}
              </span>
              {product.categoryId?.name && (
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium">
                  {translateCategory(product.categoryId.name)}
                </span>
              )}
            </div>

            <button
              onClick={() => toggleFavorite(product)}
              className={`p-2.5 rounded-full border transition-all ${
                favorited
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
              title={favorited ? "Favorited" : "Save to favorites"}
            >
              <Heart className={`w-5 h-5 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          {/* Title & Price */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>
            <div className="text-3xl font-black text-brand-navy dark:text-brand-light">
              {formatVND(product.price, { freeText: t("freeGiveaway") })}
            </div>
          </div>

          {/* Suggested Pickup Location */}
          {product.pickupLocation && (
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              <MapPin className="w-5 h-5 text-brand-blue flex-shrink-0" />
              <span>
                {t("meetingLocationLabel")}{" "}
                <strong className="text-slate-900 dark:text-white">{product.pickupLocation}</strong>
              </span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t("description")}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Primary Action: Contact Seller Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {isOwner ? (
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{t("isYourListing")}</p>
                <div className="flex items-center justify-center gap-2">
                  <Link
                    to={`/sell?edit=${product._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t("editListing")}</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors border border-slate-200 dark:border-slate-600"
                  >
                    <span>{t("manageInListings")}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full bg-brand-navy dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-brand-navy/10 hover:shadow-xl active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-brand-light" />
                <span>{t("contactSeller")}</span>
              </button>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1 px-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {t("listedOn")}{" "}
                {new Date(product.createdAt).toLocaleDateString()}
              </span>

              <button
                onClick={() => setReportModalOpen(true)}
                className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" /> {t("reportListing")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      <ContactModal
        productId={product._id}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t("reportListing")}</h3>
            {reportSent ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-center text-sm border border-emerald-200 dark:border-emerald-800">
                Thank you. Your report has been submitted to the admin moderation team.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Reason for report
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="">Select reason...</option>
                    <option value="Prohibited or dangerous item">Prohibited or dangerous item</option>
                    <option value="Misleading or inaccurate information">Misleading information</option>
                    <option value="Spam or fraudulent listing">Spam or fraudulent</option>
                    <option value="Inappropriate content">Inappropriate content</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Additional notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details for administrators..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="text-xs px-4 py-2 text-slate-600 dark:text-slate-400 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-rose-600 text-white font-semibold px-4 py-2 rounded-xl"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sticky Contact Bar */}
      {!isOwner && (
        <div className="md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider">
              Price
            </span>
            <span className="text-base font-extrabold text-brand-navy dark:text-brand-light">
              {formatVND(product.price, { freeText: t("freeGiveaway") })}
            </span>
          </div>
          <button
            onClick={() => setContactModalOpen(true)}
            className="flex-1 max-w-[200px] bg-brand-navy dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{t("contactSeller")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

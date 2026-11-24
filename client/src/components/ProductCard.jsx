import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Tag } from "lucide-react";
import { formatVND } from "../utils/formatters";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const conditionColors = {
  New: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "Like New": "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  Good: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Acceptable: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

const ProductCard = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { translateCondition, translateCategory, t } = useLanguage();
  const favorited = isFavorite(product._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please sign in to save favorite items.");
      return;
    }
    toggleFavorite(product);
  };

  const primaryImage = product.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80";

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-200 flex flex-col overflow-hidden relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Status Badge (if not Available) */}
        {product.status !== "Available" && (
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                product.status === "Reserved"
                  ? "bg-amber-500 text-white shadow-sm"
                  : product.status === "Sold"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
              {product.status === "Reserved"
                ? t("statusReserved")
                : product.status === "Sold"
                ? t("statusSold")
                : t("statusHidden")}
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            favorited
              ? "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 shadow-sm"
              : "bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500"
          }`}
          title={favorited ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart className={`w-4 h-4 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-brand-navy/90 dark:bg-brand-blue/90 backdrop-blur-md text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-bold shadow-sm">
          {formatVND(product.price)}
        </div>
      </div>

      {/* Card Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Category & Condition tags */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs">
          <span
            className={`px-1.5 sm:px-2 py-0.5 rounded-md font-medium border ${
              conditionColors[product.condition] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            {translateCondition(product.condition)}
          </span>
          {product.categoryId?.name && (
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[100px] sm:max-w-[140px]">
              {translateCategory(product.categoryId.name)}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-slate-900 dark:text-white font-semibold text-xs sm:text-sm sm:font-bold line-clamp-2 leading-snug group-hover:text-brand-blue dark:group-hover:text-brand-light transition-colors mb-2">
          {product.title}
        </h3>

        {/* Optional Pickup Location */}
        {product.pickupLocation && (
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-auto pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="truncate">{product.pickupLocation}</span>
          </div>
        )}

        {/* Seller Info */}
        <div className="flex items-center justify-between mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px] sm:max-w-[160px]">
            {product.sellerId?.fullName || "Community Member"}
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">
            {new Date(product.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

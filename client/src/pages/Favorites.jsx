import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "../components/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";

const Favorites = () => {
  const { favorites, loading } = useFavorites();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <div className="pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          <span>{t("favoritesTitle")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("favoritesSubtitle")}
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading your saved items...</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {favorites.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {t("noFavorites")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              {t("noFavoritesDesc")}
            </p>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-brand-navy dark:bg-brand-blue text-white text-xs font-semibold px-5 py-2.5 rounded-full active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4 text-brand-light" />
            {t("browseMarketplace")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;

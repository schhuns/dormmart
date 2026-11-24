import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { ArrowRight, Tag } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, translateCategory } = useLanguage();

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Categories error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("categories")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("exploreCategorySubtitle")}
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/marketplace?category=${cat._id}`}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {cat.availableCount} {cat.availableCount === 1 ? t("item") : t("items")}
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-light transition-colors">
                    {translateCategory(cat.name)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy dark:text-brand-light group-hover:text-brand-blue pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{t("browseMarketplace")}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

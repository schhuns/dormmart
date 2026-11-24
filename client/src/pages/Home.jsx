import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Package,
} from "lucide-react";

const Home = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const { t, translateCategory } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products?limit=8&status=Available"),
          api.get("/categories"),
        ]);
        setRecentProducts(prodRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Home data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-slate-900 to-brand-dark dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-blue/15 dark:bg-brand-blue/20 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-light border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("heroBadge")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t("heroTitle1")} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              {t("heroTitle2")}
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white dark:bg-slate-850 p-2 rounded-2xl sm:rounded-full shadow-2xl border border-white/20 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 flex-1 px-3 sm:px-4 py-2 w-full">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 text-base sm:text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-brand-navy dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-blue-600 text-white px-7 py-3 rounded-full text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              {t("search")}
            </button>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/marketplace"
              className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-all"
            >
              <span>{t("browseMarketplace")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={isAuthenticated ? "/sell" : "/login?redirect=/sell"}
              className="text-xs sm:text-sm font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("sellItem")}</span>
            </Link>
            <Link
              to={isAuthenticated ? "/my-listings" : "/login?redirect=/my-listings"}
              className="text-xs sm:text-sm font-semibold text-sky-300 hover:text-sky-200 flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-500/10 hover:bg-sky-500/20 transition-all border border-sky-500/20"
            >
              <Package className="w-4 h-4" />
              <span>{t("myListings")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t("exploreByCategory")}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">{t("exploreCategorySubtitle")}</p>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-semibold text-brand-blue dark:text-brand-light hover:underline flex items-center gap-1"
          >
            {t("viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat._id}
              to={`/marketplace?category=${cat._id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 flex flex-col justify-end p-3 sm:p-4 text-white shadow-sm hover:shadow-md transition-all border border-slate-200/20 dark:border-slate-800"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-xs sm:text-base leading-snug group-hover:text-brand-light transition-colors">
                  {translateCategory(cat.name)}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 inline-block">
                  {cat.availableCount} {t("items")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t("recentListings")}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">{t("recentSubtitle")}</p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs sm:text-sm font-semibold text-brand-blue dark:text-brand-light hover:underline flex items-center gap-1"
          >
            {t("seeMore")} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-3">
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base">{t("noListingsYet")}</p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 bg-brand-navy dark:bg-brand-blue text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              {t("beFirstToList")}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

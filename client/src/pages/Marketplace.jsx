import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";

const CONDITIONS = ["New", "Like New", "Good", "Acceptable"];

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, translateCategory, translateCondition } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Read query params
  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedCondition = searchParams.get("condition") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const location = searchParams.get("location") || "";
  const sort = searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(search);
  const [locationInput, setLocationInput] = useState(location);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setLocationInput(location);
  }, [location]);

  // Fetch Categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products on filter change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        params.set("status", "Available"); // Default browse available only
        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.products || []);
        const count =
          res.data.pagination?.totalCount ??
          res.data.totalCount ??
          res.data.total ??
          (res.data.products ? res.data.products.length : 0);
        setTotalCount(count);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter("search", searchInput.trim());
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    updateFilter("location", locationInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setLocationInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedCondition || minPrice || maxPrice || location
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("marketplace")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* Search input in header */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-sm pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 focus:border-brand-blue focus:outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Touch-Friendly Horizontal Category Scroll Bar (All screen sizes) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => updateFilter("category", "")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
            !selectedCategory
              ? "bg-brand-navy dark:bg-brand-blue text-white shadow-md shadow-brand-navy/20 dark:shadow-brand-blue/20"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {t("allCategories")}
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => updateFilter("category", c._id === selectedCategory ? "" : c._id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm ${
              selectedCategory === c._id
                ? "bg-brand-navy dark:bg-brand-blue text-white shadow-md shadow-brand-navy/20 dark:shadow-brand-blue/20"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <span>{translateCategory(c.name)}</span>
            {c.availableCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === c._id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {c.availableCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Layout: Filters & Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
              {t("filters")}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                {t("resetAll")}
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t("categories")}
            </label>
            <div className="space-y-1">
              <button
                onClick={() => updateFilter("category", "")}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-brand-navy dark:bg-brand-blue text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {t("allCategories")}
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => updateFilter("category", c._id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c._id
                      ? "bg-brand-navy dark:bg-brand-blue text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{translateCategory(c.name)}</span>
                  {c.availableCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === c._id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {c.availableCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t("condition")}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  onClick={() =>
                    updateFilter("condition", selectedCondition === cond ? "" : cond)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedCondition === cond
                      ? "bg-brand-navy dark:bg-brand-blue text-white border-brand-navy dark:border-brand-blue"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {translateCondition(cond)}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <form onSubmit={handleLocationSubmit} className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t("generalMeetingSpot")}
            </label>
            <input
              type="text"
              placeholder={t("meetingSpotPlaceholder")}
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
            />
          </form>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t("priceRange")}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₫"
                step="1000"
                value={minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
              <span className="text-slate-400 dark:text-slate-500">-</span>
              <input
                type="number"
                placeholder="Max ₫"
                step="1000"
                value={maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Active Filters Bar & Controls */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span>
              <span className="hidden xs:inline">
                {totalCount === 1 ? t("listingCount") : t("listingsCount")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile/Tablet Filter Trigger Button */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-blue" />
                <span>{t("filters")}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                )}
              </button>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
                  {t("sortBy")}
                </span>
                <select
                  value={sort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 sm:px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="newest">{t("newestFirst")}</option>
                  <option value="price_asc">{t("priceLowHigh")}</option>
                  <option value="price_desc">{t("priceHighLow")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Responsive Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                  <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  {t("noListingsFound")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  {t("noListingsFoundDesc")}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold bg-brand-navy dark:bg-brand-blue text-white px-5 py-2.5 rounded-full"
                >
                  {t("clearAllFilters")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Slide-Over Filter Drawer Modal */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90dvh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-slide-up sm:animate-zoom-in-95 overflow-hidden">
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-slate-900">
              <span className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
                {t("filterProducts")}
              </span>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {t("categories")}
                </label>
                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={() => updateFilter("category", "")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      !selectedCategory
                        ? "bg-brand-navy dark:bg-brand-blue text-white"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {t("allCategories")}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => updateFilter("category", c._id === selectedCategory ? "" : c._id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                        selectedCategory === c._id
                          ? "bg-brand-navy dark:bg-brand-blue text-white font-semibold"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{translateCategory(c.name)}</span>
                      {c.availableCount > 0 && (
                        <span className="text-[10px] opacity-80">({c.availableCount})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {t("condition")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      onClick={() =>
                        updateFilter("condition", selectedCondition === cond ? "" : cond)
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        selectedCondition === cond
                          ? "bg-brand-navy dark:bg-brand-blue text-white border-brand-navy dark:border-brand-blue"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {translateCondition(cond)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {t("priceRange")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ₫"
                    step="1000"
                    value={minPrice}
                    onChange={(e) => updateFilter("minPrice", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base sm:text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max ₫"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base sm:text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Meeting Spot */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {t("generalMeetingSpot")}
                </label>
                <input
                  type="text"
                  placeholder={t("meetingSpotPlaceholder")}
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onBlur={handleLocationSubmit}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base sm:text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Fixed Always-Visible Footer Action Bar */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-full text-xs font-bold transition-colors"
                >
                  {t("resetAll")}
                </button>
              )}
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex-1 bg-brand-navy dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-blue-600 text-white py-3 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all text-center"
              >
                {t("applyFilters")} ({totalCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;

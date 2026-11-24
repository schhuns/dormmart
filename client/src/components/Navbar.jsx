import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import {
  ShoppingBag,
  Search,
  Heart,
  PlusCircle,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  Store,
  Globe,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count: favoritesCount } = useFavorites();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme, isDark, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLang(lang === "vi" ? "en" : "vi");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-navy dark:bg-brand-blue flex items-center justify-center text-white shadow-sm transition-colors">
              <Store className="w-5 h-5 text-brand-light" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
                Dorm<span className="text-brand-blue dark:text-brand-light">Mart</span>
              </span>
            </div>
          </Link>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 focus:bg-white dark:focus:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-brand-blue focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/marketplace" className="hover:text-brand-blue dark:hover:text-brand-light transition-colors">
              {t("marketplace")}
            </Link>
            <Link to="/categories" className="hover:text-brand-blue dark:hover:text-brand-light transition-colors">
              {t("categories")}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-listings" className="hover:text-brand-blue dark:hover:text-brand-light transition-colors">
                  {t("myListings")}
                </Link>
                <Link
                  to="/favorites"
                  className="hover:text-brand-blue dark:hover:text-brand-light transition-colors flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>{t("favorites")}</span>
                  {favoritesCount > 0 && (
                    <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Dark Mode Quick Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all shadow-2xs"
              title={isDark ? "Switch to Light Mode" : "Chuyển sang Chế độ Tối"}
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Language Quick Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
              title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            >
              <span>{lang === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}</span>
            </button>

            {/* Prominent Sell Button (Desktop & Tablet only) */}
            <Link
              to={isAuthenticated ? "/sell" : "/login"}
              className="hidden md:flex items-center gap-2 bg-brand-navy dark:bg-brand-blue hover:bg-brand-dark dark:hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{t("sellItem")}</span>
            </Link>

            {/* User Dropdown / Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  title={t("profile")}
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-navy dark:bg-brand-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-full transition-colors"
                    title="Admin Dashboard"
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  title={t("signOut")}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-brand-navy dark:text-brand-light hover:text-brand-blue px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {t("signIn")}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu (for links not in bottom nav) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 transition-colors duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-brand-blue focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Theme Quick Toggle in mobile drawer */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{t("themeTitle")?.split("/")[0]}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme("light")}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  theme === "light"
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{t("lightMode")?.split(" ")[0] || "Light"}</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  theme === "dark"
                    ? "bg-brand-blue text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t("darkMode")?.split(" ")[0] || "Dark"}</span>
              </button>
            </div>
          </div>

          {/* Language selector in mobile drawer */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>{t("languageTitle")?.split("/")[0]}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLang("vi")}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  lang === "vi"
                    ? "bg-brand-navy dark:bg-brand-blue text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  lang === "en"
                    ? "bg-brand-navy dark:bg-brand-blue text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t("marketplace")}
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t("categories")}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t("myListings")}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t("profile")}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  {t("signOut")}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-blue dark:text-brand-light hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                {t("signIn")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

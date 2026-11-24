import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, PlusCircle, Heart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { count: favoritesCount } = useFavorites();
  const { t } = useLanguage();

  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] transition-colors duration-200">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive("/")
              ? "text-brand-blue dark:text-brand-light font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
          }`}
        >
          <Home className={`w-5 h-5 ${isActive("/") ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{t("home")}</span>
        </Link>

        {/* Marketplace */}
        <Link
          to="/marketplace"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive("/marketplace")
              ? "text-brand-blue dark:text-brand-light font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${isActive("/marketplace") ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">{t("explore")}</span>
        </Link>

        {/* Sell Button (Hero Center) */}
        <Link
          to={isAuthenticated ? "/sell" : "/login?redirect=/sell"}
          className="flex flex-col items-center justify-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-brand-navy dark:bg-brand-blue group-hover:bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-navy/30 dark:shadow-brand-blue/30 transition-transform active:scale-95">
            <PlusCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-[10px] mt-1 font-bold text-brand-navy dark:text-brand-light">{t("sell")}</span>
        </Link>

        {/* Favorites */}
        <Link
          to={isAuthenticated ? "/favorites" : "/login?redirect=/favorites"}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition-all ${
            isActive("/favorites")
              ? "text-brand-blue dark:text-brand-light font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isActive("/favorites") ? "fill-rose-500 text-rose-500 stroke-[2.5]" : "stroke-2"}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount > 9 ? "9+" : favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{t("saved")}</span>
        </Link>

        {/* Profile / Account */}
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive("/profile") || isActive("/login")
              ? "text-brand-blue dark:text-brand-light font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
          }`}
        >
          <User className={`w-5 h-5 ${isActive("/profile") || isActive("/login") ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">
            {isAuthenticated ? t("profile").split(" ")[0] : t("signIn")}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;

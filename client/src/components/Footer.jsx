import React from "react";
import { Link } from "react-router-dom";
import { Store, ShieldCheck, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center text-white">
                <Store className="w-4 h-4 text-brand-light" />
              </div>
              <span className="text-lg font-bold text-brand-navy">
                Dorm<span className="text-brand-blue">Mart</span>
              </span>
            </Link>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
              Dorm Mart is a privacy-first community marketplace connecting residents to buy and sell second-hand goods directly with each other. Zero fees, zero commissions.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy-conscious community product discovery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/marketplace" className="hover:text-brand-blue transition-colors">
                  Browse All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-brand-blue transition-colors">
                  Product Categories
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-brand-blue transition-colors">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-brand-blue transition-colors">
                  Saved Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-brand-blue transition-colors">
                  About Dorm Mart
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-brand-blue transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-blue transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Dorm Mart. Built for university dormitory communities.</p>
          <p className="flex items-center gap-1">
            Product discovery platform — arrange deals safely and independently.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

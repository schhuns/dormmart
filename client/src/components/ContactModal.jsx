import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import {
  X,
  MessageCircle,
  Phone,
  Send,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MapPin,
} from "lucide-react";

const platformIcons = {
  Zalo: { icon: MessageCircle, color: "bg-blue-500 text-white hover:bg-blue-600" },
  Telegram: { icon: Send, color: "bg-sky-500 text-white hover:bg-sky-600" },
  Messenger: { icon: MessageCircle, color: "bg-indigo-600 text-white hover:bg-indigo-700" },
  "Phone / SMS": { icon: Phone, color: "bg-emerald-600 text-white hover:bg-emerald-700" },
};

const ContactModal = ({ productId, isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${productId}/contact`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load seller contacts:", err);
        setError("Could not load contact details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Retrieving seller contact options...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{error}</p>
            <button
              onClick={onClose}
              className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Seller Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              {data.sellerAvatar ? (
                <img
                  src={data.sellerAvatar}
                  alt={data.sellerName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-navy dark:text-brand-light font-bold flex items-center justify-center text-lg">
                  {data.sellerName?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                  {t("contactSellerTitle")} {data.sellerName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("aboutItem")}{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">{data.productTitle}</span>
                </p>
              </div>
            </div>

            {/* Suggested Meeting Spot */}
            {data.pickupLocation && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>
                  {t("suggestedMeetingSpot")}{" "}
                  <strong className="text-slate-900 dark:text-white">{data.pickupLocation}</strong>
                </span>
              </div>
            )}

            {/* Communication Apps */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                {t("chooseCommunication")}
              </p>

              {data.contacts && data.contacts.length > 0 ? (
                <div className="space-y-2">
                  {data.contacts.map((c, idx) => {
                    const cfg = platformIcons[c.platform] || {
                      icon: MessageCircle,
                      color: "bg-slate-800 text-white hover:bg-slate-900",
                    };
                    const Icon = cfg.icon;

                    return (
                      <a
                        key={idx}
                        href={c.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-98 ${cfg.color}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span>{t("chatOn")} {c.platform}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs opacity-90">
                          <span>{c.value}</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    {t("noContactHandles")}
                  </p>
                </div>
              )}
            </div>

            {/* Safety Guidance */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 text-xs text-slate-500 dark:text-slate-400 space-y-1 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t("communitySafety")}</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                {t("communitySafetyDesc")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;

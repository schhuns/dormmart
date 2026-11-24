import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { usePWA } from "../context/PWAContext";
import {
  User as UserIcon,
  MessageCircle,
  Phone,
  Send,
  Save,
  CheckCircle2,
  Globe,
  Check,
  Sun,
  Moon,
  Sparkles,
  Smartphone,
} from "lucide-react";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { openInstallModal, isStandalone } = usePWA();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [zalo, setZalo] = useState(user?.contacts?.zalo || "");
  const [telegram, setTelegram] = useState(user?.contacts?.telegram || "");
  const [messenger, setMessenger] = useState(user?.contacts?.messenger || "");
  const [phone, setPhone] = useState(user?.contacts?.phone || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateUserProfile({
        fullName,
        contacts: {
          zalo,
          telegram,
          messenger,
          phone,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(t("saveFailedMsg") || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("profileTitle")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("profileSubtitle")}
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{t("savedSuccessMsg")}</span>
        </div>
      )}

      {/* Theme & Appearance Setting Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t("themeTitle")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("themeDesc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Light Mode Button */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
              theme === "light"
                ? "border-brand-blue bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-brand-blue/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {t("lightMode")}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {t("lightModeDesc")}
                </span>
              </div>
            </div>
            {theme === "light" && (
              <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
              theme === "dark"
                ? "border-brand-blue bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-brand-blue/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-900/60 text-indigo-300 flex items-center justify-center shadow-xs">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {t("darkMode")}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {t("darkModeDesc")}
                </span>
              </div>
            </div>
            {theme === "dark" && (
              <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Language Preference Setting Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-light/20 dark:bg-brand-blue/20 flex items-center justify-center text-brand-blue dark:text-brand-light">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t("languageTitle")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("languageDesc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Vietnamese Option */}
          <button
            type="button"
            onClick={() => setLang("vi")}
            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
              lang === "vi"
                ? "border-brand-blue bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-brand-blue/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="Vietnam flag">
                🇻🇳
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {t("vietnamese")}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    {t("defaultTag")}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {t("vietnameseDesc")}
                </span>
              </div>
            </div>
            {lang === "vi" && (
              <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
              lang === "en"
                ? "border-brand-blue bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-brand-blue/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="UK flag">
                🇬🇧
              </span>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {t("english")}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {t("englishDesc")}
                </span>
              </div>
            </div>
            {lang === "en" && (
              <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* App & Home Screen Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md flex-shrink-0 ring-2 ring-slate-100 dark:ring-slate-800">
              <img
                src="/apple-touch-icon.png"
                alt="Dorm Mart Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t("addToHomeScreen")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("installAppDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-1">
          {isStandalone ? (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("installedDesc")}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={openInstallModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-brand-navy dark:bg-brand-blue hover:bg-brand-dark dark:hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t("installApp")}</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Account Info (Read-only Google Info) */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt=""
              className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-xl">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {t("connectedAccount")}
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{user?.fullName}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user?.email} (Private)</span>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            {t("displayName")}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none transition-all"
          />
        </div>

        {/* Contact Channels */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t("communicationChannels")}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("communicationDesc")}
            </p>
          </div>

          {/* Zalo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>{t("zaloLabel")}</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 0901234567"
              value={zalo}
              onChange={(e) => setZalo(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none transition-all"
            />
          </div>

          {/* Telegram */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-500" />
              <span>{t("telegramLabel")}</span>
            </label>
            <input
              type="text"
              placeholder="e.g. @yourusername"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none transition-all"
            />
          </div>

          {/* Messenger */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{t("messengerLabel")}</span>
            </label>
            <input
              type="text"
              placeholder="e.g. https://m.me/yourprofile"
              value={messenger}
              onChange={(e) => setMessenger(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none transition-all"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("phoneLabel")}</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-brand-navy hover:bg-brand-blue text-white px-7 py-3 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t("saving") : t("saveSettings")}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

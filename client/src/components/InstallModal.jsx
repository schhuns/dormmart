import React from "react";
import { usePWA } from "../context/PWAContext";
import { useLanguage } from "../context/LanguageContext";
import {
  X,
  Share,
  PlusSquare,
  CheckCircle,
  Download,
  Smartphone,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const InstallModal = () => {
  const { showModal, closeInstallModal, canPromptDirectly, promptInstall, isStandalone, isIOS } =
    usePWA();
  const { t, lang } = useLanguage();

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={closeInstallModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label={t("close")}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex flex-col items-center text-center pt-2 pb-4">
          <div className="relative mb-3 group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg shadow-sky-500/10 ring-4 ring-slate-100 dark:ring-slate-800 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/icon-192.png"
                alt="Dorm Mart Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("installModalTitle")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            {t("installModalSubtitle")}
          </p>
        </div>

        {/* Content based on state */}
        {isStandalone ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 text-center my-3 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{t("installedBadge")}</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {t("installedDesc")}
            </p>
          </div>
        ) : canPromptDirectly ? (
          /* Android / Chromium 1-Click Install */
          <div className="space-y-4 my-2">
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
              {t("installAppDesc")}
            </p>
            <button
              onClick={() => {
                promptInstall();
                closeInstallModal();
              }}
              className="w-full py-3 px-4 bg-brand-blue hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md shadow-brand-blue/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <span>{t("installBtn")}</span>
            </button>
          </div>
        ) : (
          /* iOS Safari Step-by-Step Instructions */
          <div className="space-y-3.5 my-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              {t("installStepsTitle")}
            </div>

            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-brand-blue dark:text-brand-light flex items-center justify-center flex-shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("installStep1Title")}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t("installStep1Desc")}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("installStep2Title")}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t("installStep2Desc")}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("installStep3Title")}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t("installStep3Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex justify-end">
          <button
            type="button"
            onClick={closeInstallModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallModal;

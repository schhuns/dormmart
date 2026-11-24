import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ShieldCheck,
  Store,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Zap,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

const Login = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get("redirect") || "/";

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle(credentialResponse.credential);
      navigate(redirectUrl);
    } catch (err) {
      console.error("Google login failure:", err);
      setError(err.response?.data?.error || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!fullName.trim()) {
          setError("Please enter your display name.");
          setLoading(false);
          return;
        }
        await registerWithEmail(fullName.trim(), email.trim(), password);
      } else {
        await loginWithEmail(email.trim(), password);
      }
      navigate(redirectUrl);
    } catch (err) {
      console.error("Email auth error:", err);
      setError(err.response?.data?.error || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Split Card Container */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-colors">
        {/* Left Side: Brand & Community Perks (md:col-span-5) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-brand-navy via-slate-900 to-brand-dark dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                <Store className="w-5 h-5 text-brand-light" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Dorm<span className="text-brand-blue dark:text-brand-light">Mart</span>
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white leading-tight">
                Campus second-hand marketplace, made simple.
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Connect with students right next door in your dorm to discover and exchange textbooks, appliances, and everyday essentials.
              </p>
            </div>

            {/* Feature Points */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Fees & Zero Commissions</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Free community discovery. You keep 100% of every sale.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Privacy by Design</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    No university passwords, student IDs, or student records required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Direct External Contact</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Connect directly through your preferred channels: Zalo, Telegram, or Messenger.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Exclusively built for university dormitory communities</span>
          </div>
        </div>

        {/* Right Side: Authentication Form (md:col-span-7) */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="md:hidden w-12 h-12 rounded-2xl bg-brand-navy dark:bg-brand-blue flex items-center justify-center text-white mx-auto shadow-md">
              <Store className="w-6 h-6 text-brand-light" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === "signin" ? t("welcomeBack") : t("createAccount")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {mode === "signin" ? t("signInSubtitle") : t("signUpSubtitle")}
            </p>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === "signin" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === "signup" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("createAccount")}
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary 1-Click Option: Google Sign-In */}
          <div className="space-y-3">
            <div className="w-full flex justify-center max-w-full overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-In failed or was cancelled.")}
                shape="pill"
                theme="outline"
                size="large"
                text={mode === "signin" ? "signin_with" : "signup_with"}
              />
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider relative">
                {t("orContinueWithEmail")}
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  {t("displayName")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivers"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {t("emailAddress")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-navy dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-blue-600 text-white py-3 rounded-full font-bold text-xs tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("saving")}</span>
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? t("signInWithEmail") : t("createMyAccount")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Assurance Box */}
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 border border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("privacyNoticeTitle")}</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              {t("privacyNoticeDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  UploadCloud,
  X,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  Edit3,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const CONDITIONS = ["New", "Like New", "Good", "Acceptable"];

const CreateListing = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { t, translateCategory, translateCondition } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();

  const editId = paramId || searchParams.get("edit");
  const isEditing = Boolean(editId);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingListing, setLoadingListing] = useState(isEditing);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("Good");
  const [pickupLocation, setPickupLocation] = useState("");

  // Existing images (for edit mode) and new file uploads
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await api.get("/categories");
      const cats = res.data || [];
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(isEditing ? `/products/${editId}/edit` : "/sell")}`);
    }
  }, [authLoading, isAuthenticated, navigate, isEditing, editId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // In edit mode, load existing listing data
  useEffect(() => {
    if (!editId) return;

    const loadListingForEdit = async () => {
      setLoadingListing(true);
      setError(null);
      try {
        const res = await api.get(`/products/${editId}`);
        const p = res.data;
        setTitle(p.title || "");
        setDescription(p.description || "");
        setPrice(p.price === 0 ? "0" : String(p.price || ""));
        setCategoryId(p.categoryId?._id || p.categoryId || "");
        setCondition(p.condition || "Good");
        setPickupLocation(p.pickupLocation || "");
        setExistingImages(Array.isArray(p.images) ? p.images : []);
      } catch (err) {
        console.error("Failed to load listing for edit:", err);
        setError("Could not load product details to edit. Please check if the listing exists.");
      } finally {
        setLoadingListing(false);
      }
    };

    loadListingForEdit();
  }, [editId]);

  const totalImages = existingImages.length + selectedFiles.length;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + totalImages > 2) {
      alert(t("photoLimitAlert") || "You can upload a maximum of 2 images per listing.");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (totalImages === 0) {
      setError("Please add at least 1 photo of your item.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price === "" ? "0" : price);
      formData.append("categoryId", categoryId);
      formData.append("condition", condition);
      formData.append("pickupLocation", pickupLocation);

      if (isEditing) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (isEditing) {
        await api.patch(`/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate(`/products/${editId}`);
      } else {
        const res = await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate(`/products/${res.data.product._id}`);
      }
    } catch (err) {
      console.error("Listing submission error:", err);
      setError(err.response?.data?.error || (isEditing ? "Failed to update listing." : "Failed to publish listing. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingListing) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Breadcrumb & Heading */}
      <div className="space-y-2">
        {isEditing && (
          <Link
            to={`/products/${editId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-light transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to listing</span>
          </Link>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isEditing ? t("editListingTitle") : t("listAnItem")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isEditing ? t("editListingSubtitle") : t("listSubtitle")}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-8 md:p-10 shadow-sm space-y-5 sm:space-y-6">
        {/* Photo Uploader */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              {t("productPhotos")} <span className="text-rose-500">*</span>{" "}
              <span className="text-slate-400 dark:text-slate-500 font-normal">({totalImages}/2 images)</span>
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {t("photoLimit")}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-md">
            {/* Existing Images (when editing) */}
            {existingImages.map((imgUrl, idx) => (
              <div key={`existing-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group shadow-xs">
                <img src={imgUrl} alt="existing" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-2 left-2 bg-brand-navy/90 dark:bg-brand-blue/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {t("coverPhoto")}
                  </span>
                )}
              </div>
            ))}

            {/* Newly selected images */}
            {filePreviews.map((preview, idx) => (
              <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-emerald-400 dark:border-emerald-500 group shadow-xs">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  New
                </span>
              </div>
            ))}

            {/* Upload Button */}
            {totalImages < 2 && (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-blue dark:hover:border-brand-blue rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all">
                <UploadCloud className="w-7 h-7 text-slate-400 dark:text-slate-500 mb-1" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isEditing && totalImages > 0 ? t("addMorePhotos") : t("uploadPhoto")}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">JPG, PNG, WebP</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            {t("productTitle")} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Organic Chemistry 8th Edition Textbook"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none"
          />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {t("categories")} <span className="text-rose-500">*</span>
              </label>
              {categories.length === 0 && !loadingCategories && (
                <button
                  type="button"
                  onClick={fetchCategories}
                  className="text-[11px] font-semibold text-brand-blue dark:text-brand-light hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t("reloadCategories")}
                </button>
              )}
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={loadingCategories}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none cursor-pointer disabled:opacity-60"
            >
              <option value="">
                {loadingCategories
                  ? t("loadingCategories")
                  : categories.length === 0
                  ? t("reloadCategories")
                  : t("selectCategory")}
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {translateCategory(c.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              {t("condition")} <span className="text-rose-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none cursor-pointer"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {translateCondition(cond)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Asking Price & General Meeting Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {t("askingPrice")} <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {price && Number(price) > 0
                  ? Number(price).toLocaleString("en-US") + " ₫"
                  : t("freeNotice")}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 50000"
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₫
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              {t("generalMeetingSpot")}{" "}
              <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder={t("meetingSpotPlaceholder")}
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              maxLength={80}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            {t("itemDescription")} <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder={t("descPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={3000}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand-blue focus:outline-none"
          ></textarea>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isEditing ? (
            <Link
              to="/my-listings"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors order-2 sm:order-1"
            >
              {t("cancelEdit")}
            </Link>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 order-2 sm:order-1 text-center sm:text-left">
              By publishing, you agree to the Dorm Mart community guidelines.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-brand-navy dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-95"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isEditing ? t("savingChanges") : t("publishing")}</span>
              </>
            ) : isEditing ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t("saveChanges")}</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>{t("publishListing")}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;

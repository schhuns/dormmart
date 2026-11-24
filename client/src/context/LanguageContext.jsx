import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Nav & Common
    home: "Home",
    marketplace: "Marketplace",
    explore: "Explore",
    categories: "Categories",
    sellItem: "Sell an Item",
    sell: "Sell",
    saved: "Saved",
    favorites: "Favorites",
    myListings: "My Listings",
    profile: "Profile & Settings",
    signIn: "Sign In",
    signOut: "Sign Out",
    search: "Search",
    searchPlaceholder: "Search books, electronics, lamps...",
    listingCount: "listing available",
    listingsCount: "listings available",
    items: "items",
    item: "item",
    freeGiveaway: "Free / Giveaway",
    viewAll: "View all",
    seeMore: "See more",

    // Home
    heroBadge: "Direct Community Marketplace",
    heroTitle1: "Buy and Sell Within",
    heroTitle2: "Your Dorm Community",
    heroSubtitle: "Discover useful items, find great deals on second-hand goods, and connect directly with other residents in your building.",
    browseMarketplace: "Browse Marketplace",
    exploreByCategory: "Explore by Category",
    exploreCategorySubtitle: "Find what you need across our student categories",
    recentListings: "Recently Listed Items",
    recentSubtitle: "Fresh items put up for sale by fellow residents",
    noListingsYet: "No listings have been posted yet.",
    beFirstToList: "Be the first to list an item",

    // Marketplace & Filters
    filters: "Filters",
    filterProducts: "Filter Products",
    allCategories: "All Categories",
    condition: "Condition",
    priceRange: "Price Range (₫ / VND)",
    generalMeetingSpot: "General Meeting Spot",
    meetingSpotPlaceholder: "e.g. Building A lobby or Near entrance",
    resetAll: "Reset all",
    applyFilters: "Apply Filters",
    sortBy: "Sort by:",
    newestFirst: "Newest First",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    noListingsFound: "No listings found",
    noListingsFoundDesc: "We couldn't find any items matching your selected filters. Try broadening your search or resetting filters.",
    clearAllFilters: "Clear all filters",

    // Product Detail
    contactSeller: "Contact Seller",
    contactSellerTitle: "Contact",
    aboutItem: "About:",
    suggestedMeetingSpot: "Suggested meeting spot:",
    chooseCommunication: "Choose a communication channel:",
    chatOn: "Chat on",
    noContactHandles: "The seller has not configured external contact handles yet. Please check back later.",
    communitySafety: "Community Exchange Safety",
    communitySafetyDesc: "Dorm Mart does not process payments. Always arrange to inspect the item in a safe, public dormitory area (such as the lobby or entrance) before exchanging cash or transferring money.",
    meetingLocationLabel: "Meeting/Pickup Location:",
    description: "Description",
    listedOn: "Listed on",
    reportListing: "Report listing",
    isYourListing: "This is your listing.",
    manageInListings: "Manage it in My Listings →",

    // Create Listing
    listAnItem: "List an Item for Sale",
    listSubtitle: "Share unused books, clothes, or dorm equipment with your campus community. Zero commission!",
    productPhotos: "Product Photos",
    uploadPhoto: "Upload Photo",
    coverPhoto: "Cover Photo",
    photoLimit: "JPG, PNG, WebP up to 5MB (1 to 5 images)",
    productTitle: "Product Title",
    selectCategory: "Select a category...",
    loadingCategories: "Loading categories...",
    reloadCategories: "Reload Categories",
    askingPrice: "Price (₫ / VND)",
    freeNotice: "(0 = Free giveaway)",
    itemDescription: "Item Description",
    descPlaceholder: "Describe item condition, reasons for selling, and any included accessories...",
    publishListing: "Publish Listing",
    publishing: "Publishing...",

    // Profile & Settings
    profileTitle: "Profile & Settings",
    profileSubtitle: "Manage your display language, theme appearance, and external contact channels for buyers.",
    themeTitle: "Theme & Appearance",
    themeDesc: "Choose your preferred color theme for browsing Dorm Mart.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    lightModeDesc: "Crisp & bright interface",
    darkModeDesc: "Comfortable for nighttime browsing",
    languageTitle: "Display Language / Ngôn ngữ hiển thị",
    languageDesc: "Choose your preferred language across the entire Dorm Mart application.",
    vietnamese: "Tiếng Việt",
    english: "English",
    vietnameseDesc: "Giao diện tiếng Việt",
    englishDesc: "English user interface",
    defaultTag: "Default",
    connectedAccount: "Connected Account",
    displayName: "Public Display Name",
    communicationChannels: "Direct Contact Channels",
    communicationDesc: "Provide the contact channels you want to offer to interested buyers. These are only revealed when a buyer clicks 'Contact Seller'.",
    zaloLabel: "Zalo Phone Number or ID",
    telegramLabel: "Telegram Username",
    messengerLabel: "Facebook / Messenger Link",
    phoneLabel: "Phone Number (Calls / SMS)",
    saveSettings: "Save Settings",
    saving: "Saving...",
    savedSuccessMsg: "Settings saved successfully!",
    saveFailedMsg: "Failed to save settings.",

    // My Listings
    myListingsTitle: "My Product Listings",
    myListingsSubtitle: "Manage your active listings, toggle availability status, or remove sold items",
    noListingsSelf: "You haven't listed any items for sale yet.",
    listFirstItem: "List your first item now",

    // Favorites
    favoritesTitle: "Saved Favorites",
    favoritesSubtitle: "Items you are keeping an eye on from your community",
    noFavorites: "No favorites saved yet",
    noFavoritesDesc: "Click the heart icon on any product in the marketplace to bookmark it here for later.",

    // Auth & Login
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    signInSubtitle: "Sign in to manage your listings, view favorites, and contact sellers.",
    signUpSubtitle: "Create a free community account to buy and sell second-hand goods.",
    orContinueWithEmail: "Or continue with email",
    emailAddress: "Email Address",
    password: "Password",
    passwordPlaceholder: "At least 6 characters",
    signInWithEmail: "Sign In with Email",
    createMyAccount: "Create My Account",
    privacyNoticeTitle: "Strict Privacy-First Policy",
    privacyNoticeDesc: "Dorm Mart never asks for Student IDs, university credentials, or private room numbers. Your email address is never shared publicly.",

    // Conditions
    condNew: "New",
    condLikeNew: "Like New",
    condGood: "Good",
    condAcceptable: "Acceptable",

    // Statuses
    statusAvailable: "Available",
    statusReserved: "Reserved",
    statusSold: "Sold",
    statusHidden: "Hidden",
  },
  vi: {
    // Nav & Common
    home: "Trang chủ",
    marketplace: "Chợ đồ cũ",
    explore: "Khám phá",
    categories: "Danh mục",
    sellItem: "Đăng bán",
    sell: "Đăng bán",
    saved: "Đã lưu",
    favorites: "Yêu thích",
    myListings: "Tin đã đăng",
    profile: "Hồ sơ & Cài đặt",
    signIn: "Đăng nhập",
    signOut: "Đăng xuất",
    search: "Tìm kiếm",
    searchPlaceholder: "Tìm sách, đồ điện tử, đồ phòng trọ...",
    listingCount: "sản phẩm hiện có",
    listingsCount: "sản phẩm hiện có",
    items: "sản phẩm",
    item: "sản phẩm",
    freeGiveaway: "Tặng miễn phí",
    viewAll: "Xem tất cả",
    seeMore: "Xem thêm",

    // Home
    heroBadge: "Chợ Sinh Viên & Phòng Trọ Ký Túc Xá",
    heroTitle1: "Mua Bán Trao Đổi Đồ Dùng",
    heroTitle2: "Ký Túc Xá & Sinh Viên",
    heroSubtitle: "Tìm kiếm đồ dùng hữu ích, mua lại đồ cũ giá tốt và kết nối trực tiếp với các bạn sinh viên cùng tòa nhà.",
    browseMarketplace: "Khám phá chợ đồ cũ",
    exploreByCategory: "Khám phá theo danh mục",
    exploreCategorySubtitle: "Tìm nhanh đồ dùng cần thiết theo từng nhóm sản phẩm",
    recentListings: "Sản phẩm mới đăng",
    recentSubtitle: "Các vật dụng mới nhất được các bạn sinh viên đăng bán",
    noListingsYet: "Chưa có sản phẩm nào được đăng.",
    beFirstToList: "Hãy là người đầu tiên đăng bán",

    // Marketplace & Filters
    filters: "Bộ lọc",
    filterProducts: "Lọc sản phẩm",
    allCategories: "Tất cả danh mục",
    condition: "Tình trạng",
    priceRange: "Khoảng giá (₫ / VND)",
    generalMeetingSpot: "Điểm hẹn nhận đồ",
    meetingSpotPlaceholder: "VD: Sảnh tòa A, Cổng ký túc xá...",
    resetAll: "Đặt lại",
    applyFilters: "Áp dụng bộ lọc",
    sortBy: "Sắp xếp:",
    newestFirst: "Mới nhất",
    priceLowHigh: "Giá: Thấp đến cao",
    priceHighLow: "Giá: Cao đến thấp",
    noListingsFound: "Không tìm thấy sản phẩm",
    noListingsFoundDesc: "Không có đồ dùng nào khớp với bộ lọc bạn đã chọn. Hãy thử tìm từ khóa khác hoặc đặt lại bộ lọc.",
    clearAllFilters: "Xóa tất cả bộ lọc",

    // Product Detail
    contactSeller: "Liên hệ người bán",
    contactSellerTitle: "Liên hệ",
    aboutItem: "Về sản phẩm:",
    suggestedMeetingSpot: "Điểm hẹn nhận đồ gợi ý:",
    chooseCommunication: "Chọn kênh liên hệ:",
    chatOn: "Nhắn tin qua",
    noContactHandles: "Người bán chưa cài đặt kênh liên hệ. Vui lòng kiểm tra lại sau.",
    communitySafety: "An toàn giao dịch cộng đồng",
    communitySafetyDesc: "Dorm Mart không xử lý hay giữ tiền thanh toán. Hãy luôn hẹn gặp kiểm tra đồ trực tiếp tại nơi đông người (sảnh tòa nhà, cổng KTX) trước khi thanh toán.",
    meetingLocationLabel: "Địa điểm hẹn nhận hàng:",
    description: "Mô tả sản phẩm",
    listedOn: "Đăng ngày",
    reportListing: "Báo cáo tin đăng",
    isYourListing: "Đây là bài đăng của bạn.",
    manageInListings: "Quản lý trong mục Tin đã đăng →",

    // Create Listing
    listAnItem: "Đăng tin bán đồ dùng",
    listSubtitle: "Chia sẻ đồ dùng, sách vở, vật dụng phòng trọ cho bạn bè sinh viên. Hoàn toàn miễn phí, 0% hoa hồng!",
    productPhotos: "Hình ảnh sản phẩm",
    uploadPhoto: "Tải ảnh lên",
    coverPhoto: "Ảnh bìa",
    photoLimit: "Ảnh JPG, PNG, WebP tối đa 5MB (1 đến 5 ảnh)",
    productTitle: "Tiêu đề sản phẩm",
    selectCategory: "Chọn danh mục...",
    loadingCategories: "Đang tải danh mục...",
    reloadCategories: "Tải lại danh mục",
    askingPrice: "Giá bán (₫ / VND)",
    freeNotice: "(0 = Tặng miễn phí)",
    itemDescription: "Mô tả chi tiết",
    descPlaceholder: "Mô tả tình trạng đồ dùng, lý do bán, phụ kiện đi kèm nếu có...",
    publishListing: "Đăng tin ngay",
    publishing: "Đang đăng tin...",

    // Profile & Settings
    profileTitle: "Hồ sơ & Cài đặt",
    profileSubtitle: "Quản lý ngôn ngữ hiển thị, giao diện sáng/tối và các kênh liên hệ trực tiếp.",
    themeTitle: "Giao diện hiển thị / Theme",
    themeDesc: "Tùy chọn chế độ sáng hoặc tối để duyệt web thoải mái hơn.",
    lightMode: "Chế độ Sáng",
    darkMode: "Chế độ Tối",
    lightModeDesc: "Giao diện sáng tiêu chuẩn",
    darkModeDesc: "Giao diện nền tối dịu mắt ban đêm",
    languageTitle: "Ngôn ngữ hiển thị / Display Language",
    languageDesc: "Chọn ngôn ngữ bạn muốn sử dụng trên toàn bộ hệ thống Dorm Mart.",
    vietnamese: "Tiếng Việt",
    english: "English",
    vietnameseDesc: "Giao diện tiếng Việt",
    englishDesc: "English user interface",
    defaultTag: "Mặc định",
    connectedAccount: "Tài khoản kết nối",
    displayName: "Tên hiển thị công khai",
    communicationChannels: "Kênh liên hệ trực tiếp",
    communicationDesc: "Cung cấp các kênh liên hệ bạn muốn người mua thấy. Các kênh này chỉ hiển thị khi người mua nhấn 'Liên hệ người bán'.",
    zaloLabel: "Số điện thoại hoặc ID Zalo",
    telegramLabel: "Username Telegram",
    messengerLabel: "Liên kết Facebook / Messenger",
    phoneLabel: "Số điện thoại gọi / SMS (Tùy chọn)",
    saveSettings: "Lưu cài đặt",
    saving: "Đang lưu...",
    savedSuccessMsg: "Đã lưu cài đặt thành công!",
    saveFailedMsg: "Không thể lưu cài đặt. Vui lòng thử lại.",

    // My Listings
    myListingsTitle: "Danh sách tin đã đăng",
    myListingsSubtitle: "Quản lý các tin đăng đang bán, cập nhật trạng thái hoặc xóa tin khi đã bán xong",
    noListingsSelf: "Bạn chưa đăng bán món đồ nào.",
    listFirstItem: "Đăng món đồ đầu tiên ngay",

    // Favorites
    favoritesTitle: "Sản phẩm đã lưu",
    favoritesSubtitle: "Những món đồ bạn đang quan tâm từ cộng đồng",
    noFavorites: "Chưa có sản phẩm nào được lưu",
    noFavoritesDesc: "Nhấn vào biểu tượng trái tim ở bất kỳ sản phẩm nào trên chợ để lưu lại xem sau.",

    // Auth & Login
    welcomeBack: "Chào mừng trở lại",
    createAccount: "Tạo tài khoản mới",
    signInSubtitle: "Đăng nhập để quản lý tin đăng, xem danh sách yêu thích và liên hệ người bán.",
    signUpSubtitle: "Tạo tài khoản miễn phí để mua bán, trao đổi đồ cũ trong ký túc xá.",
    orContinueWithEmail: "Hoặc tiếp tục bằng Email",
    emailAddress: "Địa chỉ Email",
    password: "Mật khẩu",
    passwordPlaceholder: "Tối thiểu 6 ký tự",
    signInWithEmail: "Đăng nhập với Email",
    createMyAccount: "Tạo tài khoản ngay",
    privacyNoticeTitle: "Chính sách bảo mật hàng đầu",
    privacyNoticeDesc: "Dorm Mart tuyệt đối không thu thập mã số sinh viên hay thông tin cá nhân phòng trọ. Email của bạn luôn được bảo mật.",

    // Conditions
    condNew: "Mới 100%",
    condLikeNew: "Như mới (99%)",
    condGood: "Còn tốt",
    condAcceptable: "Dùng được",

    // Statuses
    statusAvailable: "Đang bán",
    statusReserved: "Đã đặt trước",
    statusSold: "Đã bán",
    statusHidden: "Đã ẩn",
  },
};

// Vietnamese translations for blueprint categories
export const categoryNameMap = {
  vi: {
    "Books & Education": "Sách & Giáo trình",
    "Clothing & Shoes": "Quần áo & Giày dép",
    "Electronics & Accessories": "Điện tử & Phụ kiện",
    "Stationery": "Văn phòng phẩm",
    "Bags & Accessories": "Túi xách & Balo",
    "Dorm Essentials": "Đồ dùng phòng trọ",
    "Kitchen & Household Items": "Đồ bếp & Gia dụng",
    "Sports & Recreation": "Thể thao & Giải trí",
    "Other Permitted Items": "Đồ dùng khác",
  },
  en: {},
};

export const conditionMap = {
  vi: {
    New: "Mới 100%",
    "Like New": "Như mới",
    Good: "Còn tốt",
    Acceptable: "Dùng được",
  },
  en: {
    New: "New",
    "Like New": "Like New",
    Good: "Good",
    Acceptable: "Acceptable",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Vietnamese if previously chosen or detect Vietnamese locale
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("dormmart_lang") || "vi";
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("dormmart_lang", newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  const translateCategory = (name) => {
    if (!name) return "";
    if (lang === "vi" && categoryNameMap.vi[name]) {
      return categoryNameMap.vi[name];
    }
    return name;
  };

  const translateCondition = (cond) => {
    if (!cond) return "";
    return conditionMap[lang]?.[cond] || cond;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        translateCategory,
        translateCondition,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Default values used for StoreSettings reset and initial seeding
export const DEFAULT_STORE = {
  logo_url: null,
  logo_storage_path: null,
  accent_color: "#1a1a2e",
  phone: "",
  email: "",
  address_en: "",
  address_ar: "",
};

export const DEFAULT_LOGO_PATH = "/logo.png";

export const DEFAULT_ABOUT_SECTIONS = [
  { section_key: "hero",         title_en: "", title_ar: "", body_en: null, body_ar: null, display_order: 0 },
  { section_key: "mission",      title_en: "", title_ar: "", body_en: "",   body_ar: "",   display_order: 1 },
  { section_key: "how_it_works", title_en: "", title_ar: "", body_en: "",   body_ar: "",   display_order: 2 },
  { section_key: "commitment",   title_en: "", title_ar: "", body_en: "",   body_ar: "",   display_order: 3 },
];

export const DEFAULT_ABOUT_STATS = [
  { stat_key: "partner_clinics", label_en: "Partner Clinics",  label_ar: "العيادات الشريكة", value: "500+", display_order: 0 },
  { stat_key: "distributors",    label_en: "Top Distributors", label_ar: "أبرز الموزعين",     value: "120",  display_order: 1 },
  { stat_key: "products",        label_en: "Products",         label_ar: "المنتجات",           value: "2,400+",display_order: 2 },
  { stat_key: "years_active",    label_en: "Years Active",     label_ar: "سنوات العمل",        value: "8",    display_order: 3 },
];

export const DEFAULT_LEGAL_PAGES = [
  { 
    page_key: "terms_of_use",    
    content_en: "1. Acceptance of Terms\nBy accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.\n\n2. Provision of Services\nDentQ reserves the right to modify or discontinue any service with or without notice to the user.\n\n3. Privacy Policy\nYour privacy is very important to us. Please review our Privacy Policy to understand our practices.", 
    content_ar: "١. قبول الشروط\nمن خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية.\n\n٢. تقديم الخدمات\nتحتفظ شركة DentQ بالحق في تعديل أو إيقاف أي خدمة مع أو بدون إشعار للمستخدم.\n\n٣. سياسة الخصوصية\nخصوصيتك مهمة جداً بالنسبة لنا. يرجى مراجعة سياسة الخصوصية الخاصة بنا لفهم ممارساتنا." 
  },
  { 
    page_key: "privacy_policy",  
    content_en: "1. Information Collection\nWe collect information from you when you register on our site, place an order, or subscribe to our newsletter.\n\n2. Information Usage\nAny of the information we collect from you may be used to personalize your experience, improve our website, or process transactions.\n\n3. Information Protection\nWe implement a variety of security measures to maintain the safety of your personal information.", 
    content_ar: "١. جمع المعلومات\nنقوم بجمع المعلومات منك عند التسجيل في موقعنا، تقديم طلب، أو الاشتراك في نشرتنا الإخبارية.\n\n٢. استخدام المعلومات\nأي من المعلومات التي نجمعها منك قد تستخدم لتخصيص تجربتك، تحسين موقعنا، أو معالجة المعاملات.\n\n٣. حماية المعلومات\nنحن نطبق مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية." 
  },
];

export const DEFAULT_FOOTER = {
  slogan_en: "Egypt's trusted dental supply platform",
  slogan_ar: "شريكك الموثوق لمستلزمات الأسنان",
  Links: [
    { platform: "facebook", url: "https://facebook.com" },
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "whatsapp", url: "https://wa.me/201000000000" }
  ]
};


// KNOWN_PATHS: predefined options for navigation link picker
export const KNOWN_PATHS = [
  { label: "Home",           path: "/" },
  { label: "Products / Shop",path: "/products" },
  { label: "About Us",       path: "/about" },
  { label: "Contact",        path: "/contact" },
  { label: "My Account",     path: "/profile" },
  { label: "My Orders",      path: "/myorders" },
  { label: "Cart",           path: "/cart" },
  { label: "Notifications",  path: "/notifications" },
  { label: "Terms of Use",   path: "/terms-and-conditions" },
  { label: "Privacy Policy", path: "/privacy-policy" },
];

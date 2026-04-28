import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
  Save, Trash2, Upload, Link as LinkIcon, Image as ImageIcon, X, Globe, 
  ShoppingBag, Layers, Package, ShoppingCart, Pencil, AlertCircle, Search, ChevronDown,
  CheckCircle2, XCircle
} from "lucide-react";
import { getLinkCategories, getLinkProducts, uploadBannerImage } from "../actions";
import toast from "react-hot-toast";
import styles from "./BannerEditor.module.css";

const slugify = (text) => {
  if (!text) return "";
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
};

const BannerEditor = ({ banner, isCreating, isSaving, onSave, onDelete }) => {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(banner);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);

  const fileInputRef = useRef(null);
  const lang = i18n.language.startsWith("en") ? "en" : "ar";

  useEffect(() => {
    setForm(banner);
    setIsManualInput(false);
  }, [banner]);

  useEffect(() => {
    getLinkCategories().then(setCategories);
    getLinkProducts().then(setProducts);
  }, []);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadBannerImage(file);
      set("image", url);
      toast.success(t("common.upload_success") || "Image uploaded!");
    } catch (err) {
      toast.error(t("common.upload_error") || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Hierarchy Logic ---
  const buildTree = (items, parentId = null, level = 0) => {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => [
        { ...item, level },
        ...buildTree(items, item.id, level + 1)
      ])
      .flat();
  };
  const categoryOptions = buildTree(categories);

  const getLinkType = () => {
    if (form.related_cat_id) return "category";
    const l = form.cta_link || "";
    if (l === "/" || l === "/all-products" || l === "/cart") return l;
    if (l.includes("/dp/")) return "product";
    return "/";
  };
  const linkType = getLinkType();

  const handleLinkPartChange = (type, value) => {
    if (type === "category") {
      set("cta_link", null);
      set("related_cat_id", value);
    } else if (type === "product") {
       set("related_cat_id", null);
       const prod = products.find(p => p.id === value);
       if (prod) set("cta_link", `${slugify(prod.nameEn)}/dp/${prod.id}`);
       else set("cta_link", `/dp/${value}`);
    } else {
       set("cta_link", type);
       set("related_cat_id", null);
    }
  };

  // --- Validation Logic ---
  const isLinkValid = useMemo(() => {
    if (form.related_cat_id) {
       return categories.some(c => c.id.toString() === form.related_cat_id.toString());
    }
    const l = form.cta_link || "";
    if (l === "/" || l === "/all-products" || l === "/cart") return true;
    if (l.includes("/dp/")) {
      const id = l.split("/").pop();
      return products.some(p => p.id.toString() === id.toString());
    }
    return false;
  }, [form.cta_link, form.related_cat_id, categories, products]);

  const colors = Array.isArray(form.bg_linear_colors) ? form.bg_linear_colors : ["#185FA5", "#378ADD"];
  const gradient = `linear-gradient(135deg, ${colors.join(", ")})`;
  const heroStyle = {
    backgroundImage: form.image ? `url(${form.image})` : gradient,
    "--cta-bg": form.cta_bg_color || "#14b8a6",
    "--cta-txt": form.cta_txt_color || "#ffffff",
  };

  const tp = (key, def) => t(`admin.marketing.banners.editor.${key}`, def);

  return (
    <form className={styles.editor} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      {/* LIVE PREVIEW */}
      <div className={styles.previewContainer}>
        <div className={styles.previewHeaderRow}>
          <div className={styles.previewLabel}>{tp("live_preview", "LIVE PREVIEW")}</div>
          <div className={styles.liveBadge}><div className={styles.pulse} /> {tp("online", "ONLINE")}</div>
        </div>
        <div className={styles.heroSection} style={heroStyle} dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className={styles.overlay}></div>
          <div className={styles.contentWrapper}>
            <h2 className={styles.Title} style={{ color: form.title_color || '#ffffff' }}>{form[`title_${lang === 'en' ? 'en' : 'ar'}`] || "Banner Title"}</h2>
            {form[`subtitle_${lang === 'en' ? 'en' : 'ar'}`] && <h3 className={styles.subTitle} style={{ color: form.subtitle_color || '#e2e8f0' }}>{form[`subtitle_${lang === 'en' ? 'en' : 'ar'}`]}</h3>}
            {form[`cta_text_${lang === 'en' ? 'en' : 'ar'}`] && <div className={styles.ctaBtn}>{form[`cta_text_${lang === 'en' ? 'en' : 'ar'}`]}</div>}
          </div>
        </div>
      </div>

      <div className={styles.scrollArea}>
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>📝 {tp("content", "CONTENT")}</h4>
          <div className={styles.row2}>
            <Field label={tp("title_en", "Title EN")} value={form.title_en} onChange={(v) => set("title_en", v)} />
            <Field label={tp("title_ar", "العنوان عربي")} value={form.title_ar} onChange={(v) => set("title_ar", v)} dir="rtl" />
          </div>
          <div className={styles.row2}>
            <Field label={tp("subtitle_en", "Subtitle EN")} value={form.subtitle_en} onChange={(v) => set("subtitle_en", v)} />
            <Field label={tp("subtitle_ar", "العنوان الفرعي عربي")} value={form.subtitle_ar} onChange={(v) => set("subtitle_ar", v)} dir="rtl" />
          </div>
        </section>

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>🖼 {tp("background", "BACKGROUND")}</h4>
          <div className={styles.mediaOptions}>
            <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
              {isUploading ? <div className={styles.loaderSmall} /> : form.image ? <img src={form.image} alt="Preview" className={styles.miniPreview} /> : <><Upload size={18} /><span>{tp("upload_image", "Upload Image")}</span></>}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
            </div>
            <div className={styles.gradientSection}>
               <div className={styles.gradientStrip} style={{ background: gradient }} />
               <div className={styles.row2}>
                  <ColorField label={tp("color_a", "Color A")} value={colors[0]} onChange={(v) => set("bg_linear_colors", [v, colors[1]])} />
                  <ColorField label={tp("color_b", "Color B")} value={colors[1] || colors[0]} onChange={(v) => set("bg_linear_colors", [colors[0], v])} />
               </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>🔗 {tp("link_btn", "LINK & BUTTON")}</h4>
          <div className={styles.row2}>
            <Field label={tp("cta_en", "Btn Text EN")} value={form.cta_text_en} onChange={(v) => set("cta_text_en", v)} />
            <Field label={tp("cta_ar", "Btn Text AR")} value={form.cta_text_ar} onChange={(v) => set("cta_text_ar", v)} dir="rtl" />
          </div>
          
          <div className={styles.field}>
            <label>{tp("link_type", "Link Type")}</label>
            <div className={styles.segmentedControl}>
              {[
                { id: "/", icon: <Globe size={14} />, label: tp("home", "Home") },
                { id: "/all-products", icon: <ShoppingBag size={14} />, label: tp("shop", "Shop") },
                { id: "category", icon: <Layers size={14} />, label: tp("category", "Category") },
                { id: "product", icon: <Package size={14} />, label: tp("product", "Product") },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.segment} ${linkType === opt.id ? styles.segmentActive : ""}`}
                  onClick={() => handleLinkPartChange(opt.id, "")}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {(linkType === "category" || linkType === "product") && (
            <div className={styles.linkEditorBox}>
               <div className={styles.linkHeaderRow}>
                  <span>{linkType === "category" ? tp("target_cat", "Target Category") : tp("target_prod", "Target Product")}</span>
                  <button type="button" className={styles.textBtn} onClick={() => setIsManualInput(!isManualInput)}>
                     <Pencil size={11} /> {isManualInput ? tp("use_search", "Use Search") : tp("manual_id", "Manual ID")}
                  </button>
               </div>

               {isManualInput ? (
                  <input 
                    className={styles.input}
                    placeholder={tp("id_placeholder", `Paste ${linkType} ID here...`)}
                    value={(form.related_cat_id || form.cta_link?.split("/").pop()) || ""}
                    onChange={(e) => handleLinkPartChange(linkType, e.target.value)}
                  />
               ) : (
                  <StylishDropdown 
                    type={linkType}
                    categories={categoryOptions}
                    products={products}
                    value={(form.related_cat_id || form.cta_link?.split("/").pop()) || ""}
                    onChange={(val) => handleLinkPartChange(linkType, val)}
                    lang={lang}
                    t={t}
                  />
               )}
            </div>
          )}

          <div className={`${styles.finalPathBox} ${isLinkValid ? styles.validLink : styles.invalidLink}`}>
             {isLinkValid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
             <span>{tp("final_url", "Final URL")}: <strong>#{form.related_cat_id ? `category/${form.related_cat_id}` : (form.cta_link || "None")}</strong></span>
             <div className={`${styles.validPulse} ${isLinkValid ? styles.valid : styles.invalid}`} />
          </div>

          <div className={styles.row2}>
             <ColorField label={tp("btn_bg", "Btn BG")} value={form.cta_bg_color || "#14b8a6"} onChange={(v) => set("cta_bg_color", v)} />
             <ColorField label={tp("btn_text", "Btn Text")} value={form.cta_txt_color || "#ffffff"} onChange={(v) => set("cta_txt_color", v)} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.toggleRow}>
             <span className={styles.togLabel}>{tp("active_label", "Active on storefront")}</span>
             <label className={styles.toggle}>
                <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
                <span className={styles.toggleSlider} />
             </label>
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
          <Save size={16} /> {tp("save", "Save Banner")}
        </button>
        {!isCreating && <button type="button" className={styles.deleteBtn} onClick={onDelete}><Trash2 size={16} /></button>}
      </div>
    </form>
  );
};

// --- Stylish Searchable Dropdown ---
const StylishDropdown = ({ type, categories, products, value, onChange, lang, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const data = type === "category" ? categories.map(c => ({ id: c.id, label: (c.level > 0 ? "— ".repeat(c.level) : "") + (lang === 'en' ? c.name_en : c.name_ar) })) 
                                 : products.map(p => ({ id: p.id, label: lang === 'en' ? p.nameEn : p.nameAr }));

  const filtered = data.filter(item => item.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = data.find(i => i.id === value)?.label || t("admin.marketing.banners.editor.choose", "Choose...");

  return (
    <div className={styles.stylishDropdown} ref={dropdownRef}>
      <button type="button" className={styles.dropdownTrigger} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className={isOpen ? styles.rotated : ""} />
      </button>

      {isOpen && (
        <div className={styles.dropdownPortal}>
           <div className={styles.searchBox}>
              <Search size={14} />
              <input 
                autoFocus 
                placeholder={t("admin.products.search_placeholder", "Search...")} 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
           </div>
           <div className={styles.dropdownList}>
              {filtered.length === 0 && <div className={styles.noResult}>{t("admin.search.no_results", "No results found")}</div>}
              {filtered.map(item => (
                <div 
                  key={item.id} 
                  className={`${styles.dropdownItem} ${item.id === value ? styles.activeItem : ""}`}
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {item.label}
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder, dir }) => (
  <div className={styles.field}><label>{label}</label><input className={styles.input} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={dir} /></div>
);

const ColorField = ({ label, value, onChange }) => (
  <div className={styles.field}><label>{label}</label><div className={styles.colorRow}><input type="color" value={value} onChange={(e) => onChange(e.target.value)} className={styles.colorPicker} /><input className={styles.input} value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" /></div></div>
);

export default BannerEditor;

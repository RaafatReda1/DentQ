import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Save, Trash2 } from "lucide-react";
import { getLinkCategories, getLinkProducts, uploadBannerImage } from "../../../api/marketingApi";
import toast from "react-hot-toast";
import styles from "./BannerEditor.module.css";

// Sub-components
import EditorPreview from "./components/EditorPreview";
import EditorContent from "./components/EditorContent";
import EditorMedia from "./components/EditorMedia";
import EditorLinks from "./components/EditorLinks";
import EditorSettings from "./components/EditorSettings";

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
    return "category";
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
      <EditorPreview form={form} lang={lang} tp={tp} heroStyle={heroStyle} />

      <div className={styles.scrollArea}>
        <EditorContent form={form} set={set} tp={tp} />

        <EditorMedia
          form={form} set={set} tp={tp}
          colors={colors} gradient={gradient}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
        />

        <EditorLinks
          form={form} set={set} tp={tp} t={t} lang={lang}
          linkType={linkType}
          handleLinkPartChange={handleLinkPartChange}
          isManualInput={isManualInput}
          setIsManualInput={setIsManualInput}
          categoryOptions={categoryOptions}
          products={products}
          isLinkValid={isLinkValid}
        />

        <EditorSettings form={form} set={set} tp={tp} />
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

export default BannerEditor;

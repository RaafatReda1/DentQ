import React from "react";
import { Globe, ShoppingBag, Layers, Package, Pencil, CheckCircle2, XCircle } from "lucide-react";
import styles from "../BannerEditor.module.css";
import { Field, ColorField } from "./CommonFields";
import LinkSelector from "./LinkSelector";

const EditorLinks = ({ 
  form, set, tp, t, lang, linkType, handleLinkPartChange, 
  isManualInput, setIsManualInput, categoryOptions, products, isLinkValid 
}) => {
  return (
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
              <LinkSelector 
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
  );
};

export default EditorLinks;

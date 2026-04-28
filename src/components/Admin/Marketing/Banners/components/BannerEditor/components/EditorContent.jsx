import React from "react";
import styles from "../BannerEditor.module.css";
import { Field } from "./CommonFields";

const EditorContent = ({ form, set, tp }) => {
  return (
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
  );
};

export default EditorContent;

import React from "react";
import styles from "../BannerEditor.module.css";

const EditorSettings = ({ form, set, tp }) => {
  return (
    <section className={styles.section}>
      <div className={styles.toggleRow}>
         <span className={styles.togLabel}>{tp("active_label", "Active on storefront")}</span>
         <label className={styles.toggle}>
            <input 
              type="checkbox" 
              checked={form.is_active} 
              onChange={(e) => set("is_active", e.target.checked)} 
            />
            <span className={styles.toggleSlider} />
         </label>
      </div>
    </section>
  );
};

export default EditorSettings;

import React from "react";
import { Upload } from "lucide-react";
import styles from "../BannerEditor.module.css";
import { ColorField } from "./CommonFields";

const EditorMedia = ({ form, set, tp, colors, gradient, isUploading, handleImageUpload, fileInputRef }) => {
  return (
    <section className={styles.section}>
      <h4 className={styles.sectionTitle}>🖼 {tp("background", "BACKGROUND")}</h4>
      <div className={styles.mediaOptions}>
        <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
          {isUploading ? (
            <div className={styles.loaderSmall} />
          ) : form.image ? (
            <img src={form.image} alt="Preview" className={styles.miniPreview} />
          ) : (
            <>
              <Upload size={18} />
              <span>{tp("upload_image", "Upload Image")}</span>
            </>
          )}
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
  );
};

export default EditorMedia;

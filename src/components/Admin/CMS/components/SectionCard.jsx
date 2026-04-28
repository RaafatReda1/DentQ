import React from "react";
import styles from "./SectionCard.module.css";
import { Save, RotateCcw, Loader2 } from "lucide-react";

const SectionCard = ({ id, title, subtitle, saveLabel = "Save changes", onSave, onDiscard, saving, isDirty, children }) => (
  <section className={styles.card} id={id}>
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        {onDiscard && isDirty && (
          <button className={styles.discardBtn} onClick={onDiscard} disabled={saving}>
            <RotateCcw size={14} /> Discard
          </button>
        )}
        <button
          className={`${styles.saveBtn} ${isDirty ? styles.saveBtnActive : ""}`}
          onClick={onSave}
          disabled={saving || !isDirty}
        >
          {saving ? <Loader2 size={14} className={styles.spin} /> : <Save size={14} />}
          {saving ? "Saving..." : saveLabel}
        </button>
      </div>
    </div>
    <div className={styles.body}>{children}</div>
  </section>
);

export default SectionCard;

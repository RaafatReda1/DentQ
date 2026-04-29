import React from "react";
import styles from "./SectionCard.module.css";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const SectionCard = ({ id, title, subtitle, saveLabel, onSave, onDiscard, onResetToDefault, saving, isDirty, children }) => {
  const { t } = useTranslation();
  
  return (
    <section className={styles.card} id={id}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.actions}>
          {onResetToDefault && (
            <button className={styles.globalResetBtn} onClick={onResetToDefault} disabled={saving} title={t("admin.cms.common.reset", "Reset to default")}>
              <RotateCcw size={14} /> {t("admin.cms.common.reset", "Reset to default")}
            </button>
          )}
          {onDiscard && isDirty && (
            <button className={styles.discardBtn} onClick={onDiscard} disabled={saving}>
              <RotateCcw size={14} /> {t("admin.cms.common.discard", "Discard")}
            </button>
          )}
          <button
            className={`${styles.saveBtn} ${isDirty ? styles.saveBtnActive : ""}`}
            onClick={onSave}
            disabled={saving || !isDirty}
          >
            {saving ? <Loader2 size={14} className={styles.spin} /> : <Save size={14} />}
            {saving ? t("admin.cms.common.saving", "Saving...") : (saveLabel || t("admin.cms.common.save", "Save changes"))}
          </button>
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
};

export default SectionCard;

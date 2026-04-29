import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./BilingualField.module.css";

const Badge = ({ lang }) => {
  const { t } = useTranslation();
  return (
    <span className={`${styles.badge} ${lang === "en" ? styles.badgeEn : styles.badgeAr}`} aria-hidden="true">
      {lang === "en" ? t("admin.cms.common.english", "EN") : t("admin.cms.common.arabic", "AR")}
    </span>
  );
};

const BilingualField = ({
  label,
  valueEn, valueAr,
  onChangeEn, onChangeAr,
  multiline = false,
  rows = 4,
  placeholderEn = "",
  placeholderAr = "",
  hint = "",
}) => {
  const Tag = multiline ? "textarea" : "input";
  const idEn = `bf-${label?.replace(/\s+/g, "-").toLowerCase()}-en`;
  const idAr = `bf-${label?.replace(/\s+/g, "-").toLowerCase()}-ar`;

  return (
    <div className={styles.grid}>
      {/* English side */}
      <div className={styles.fieldGroup}>
        <label htmlFor={idEn} className={styles.label}>
          {label} <Badge lang="en" />
        </label>
        <Tag
          id={idEn}
          className={styles.input}
          value={valueEn ?? ""}
          onChange={(e) => onChangeEn(e.target.value)}
          placeholder={placeholderEn}
          dir="ltr"
          rows={multiline ? rows : undefined}
        />
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>

      {/* Arabic side */}
      <div className={styles.fieldGroup}>
        <label htmlFor={idAr} className={styles.label}>
          {label} <Badge lang="ar" />
        </label>
        <Tag
          id={idAr}
          className={styles.input}
          value={valueAr ?? ""}
          onChange={(e) => onChangeAr(e.target.value)}
          placeholder={placeholderAr}
          dir="rtl"
          rows={multiline ? rows : undefined}
        />
      </div>
    </div>
  );
};

export default BilingualField;

import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import { useLegalPages, useUpsertLegalPage } from "../hooks/cmsHooks";
import { DEFAULT_LEGAL_PAGES } from "../config/defaults";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./LegalEditor.module.css";
import { Eye, RotateCcw } from "lucide-react";

const LegalEditor = () => {
  const { t } = useTranslation();

  const TABS = [
    { key: "terms_of_use",   label: t("admin.cms.legal.terms", "Terms of use") },
    { key: "privacy_policy", label: t("admin.cms.legal.privacy", "Privacy policy") },
  ];
  const { data: remote, isLoading } = useLegalPages();
  const { mutate: save, isPending: saving } = useUpsertLegalPage();
  const [activeKey, setActiveKey] = useState("terms_of_use");
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    if (isLoading) return;

    // Handle both: DB has rows, or DB is empty (use defaults)
    const pages = remote && remote.length > 0 ? remote : DEFAULT_LEGAL_PAGES;
    const map = {};
    pages.forEach((p) => { map[p.page_key] = p; });

    // Make sure both keys always exist
    TABS.forEach(({ key }) => {
      if (!map[key]) {
        const def = DEFAULT_LEGAL_PAGES.find(p => p.page_key === key);
        map[key] = { ...def };
      }
    });

    setDrafts(map);
  }, [remote, isLoading]);

  if (isLoading || !Object.keys(drafts).length) {
    return (
      <div className={styles.skeletonWrap} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <Skeleton variant="rectangular" width="100%" height={80} style={{ borderRadius: 12 }} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={200} style={{ borderRadius: 8 }} />
        <Skeleton variant="rectangular" width="100%" height={200} style={{ borderRadius: 8 }} />
      </div>
    );
  }

  const current = drafts[activeKey] || { page_key: activeKey, content_en: "", content_ar: "" };
  const originalPages = remote && remote.length > 0 ? remote : DEFAULT_LEGAL_PAGES;
  const original = originalPages.find((p) => p.page_key === activeKey) || { content_en: "", content_ar: "" };
  const isDirty = current.content_en !== original.content_en || current.content_ar !== original.content_ar;

  const set = (field, val) =>
    setDrafts((prev) => ({ ...prev, [activeKey]: { ...prev[activeKey], [field]: val } }));

  const handleDiscard = () =>
    setDrafts((prev) => ({ ...prev, [activeKey]: { ...original } }));

  const handleResetToDefault = () => {
    const def = DEFAULT_LEGAL_PAGES.find(p => p.page_key === activeKey);
    setDrafts((prev) => ({ ...prev, [activeKey]: { ...def } }));
  };

  const enCount = (current.content_en || "").length;
  const arCount = (current.content_ar || "").length;
  const activeLabel = TABS.find((t) => t.key === activeKey)?.label ?? "";

  return (
    <SectionCard
      id="legal-editor"
      title={t("admin.cms.legal.title", "Legal pages")}
      subtitle={t("admin.cms.legal.subtitle", "Terms of use and privacy policy displayed at checkout and in the footer")}
      saveLabel={activeKey === "terms_of_use" ? t("admin.cms.legal.save_terms", "Save terms of use") : t("admin.cms.legal.save_privacy", "Save privacy policy")}
      onSave={() => save(current)}
      onDiscard={handleDiscard}
      onResetToDefault={handleResetToDefault}
      saving={saving}
      isDirty={isDirty}
    >
      {/* Header Controls */}
      <div className={styles.headerControls}>
        <div className={styles.tabBar}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.tab} ${activeKey === key ? styles.activeTab : ""}`}
              onClick={() => setActiveKey(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.editorGrid}>
        {/* EN Content */}
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor={`legal-en-${activeKey}`}>
              {activeLabel.toUpperCase()} <span className={styles.badgeEn} aria-hidden="true">{t("admin.cms.common.english", "EN")}</span>
            </label>
            <span className={styles.warningBadge}>{t("admin.cms.legal.live_editor", "Live Editor")}</span>
          </div>
          <textarea
            id={`legal-en-${activeKey}`}
            className={styles.textarea}
            value={current.content_en || ""}
            onChange={(e) => set("content_en", e.target.value)}
            rows={15}
            dir="ltr"
            placeholder={t("admin.cms.legal.write_here", "Write your {label} here...").replace("{label}", activeLabel.toLowerCase())}
          />
          <p className={styles.charCount}>{enCount.toLocaleString()} characters</p>
        </div>

        {/* Live Preview Column */}
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
               {t("admin.cms.footer.live_preview", "Live Storefront Preview")}
            </label>
            <Eye size={14} className={styles.eyeIcon} />
          </div>
          <div className={styles.previewBox} dir="ltr">
             <div className={styles.previewContent}>
                <p style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "12px", lineHeight: "1.6", color: "#334155" }}>
                  {current.content_en || "Empty content..."}
                </p>
             </div>
          </div>
        </div>

        {/* AR Content */}
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor={`legal-ar-${activeKey}`}>
              {activeLabel.toUpperCase()} <span className={styles.badgeAr} aria-hidden="true">{t("admin.cms.common.arabic", "AR")}</span>
            </label>
          </div>
          <textarea
            id={`legal-ar-${activeKey}`}
            className={styles.textarea}
            value={current.content_ar || ""}
            onChange={(e) => set("content_ar", e.target.value)}
            rows={15}
            dir="rtl"
            placeholder="أدخل النص بالعربية هنا…"
          />
          <p className={styles.charCount}>{arCount.toLocaleString()} characters</p>
        </div>

        {/* AR Live Preview Column */}
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
               {t("admin.cms.footer.live_preview", "Live Storefront Preview")} (AR)
            </label>
            <Eye size={14} className={styles.eyeIcon} />
          </div>
          <div className={styles.previewBox} dir="rtl">
             <div className={styles.previewContent}>
                <p style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "12px", lineHeight: "1.6", color: "#334155" }}>
                  {current.content_ar || "محتوى فارغ..."}
                </p>
             </div>
          </div>
        </div>
      </div>

      <p className={styles.footerHint}>
        Plain text only · Line breaks are preserved exactly as they appear in the live preview
      </p>
    </SectionCard>
  );
};

export default LegalEditor;

import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import { useLegalPages, useUpsertLegalPage } from "../hooks/cmsHooks";
import styles from "./LegalEditor.module.css";

const TABS = [
  { key: "terms_of_use", label: "Terms of use" },
  { key: "privacy_policy", label: "Privacy policy" },
];

const LegalEditor = () => {
  const { data: remote } = useLegalPages();
  const { mutate: save, isPending: saving } = useUpsertLegalPage();
  const [activeKey, setActiveKey] = useState("terms_of_use");
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    if (remote) {
      const map = {};
      remote.forEach((p) => { map[p.page_key] = p; });
      setDrafts(map);
    }
  }, [remote]);

  if (!Object.keys(drafts).length) return <div className={styles.loading}>Loading legal pages…</div>;

  const current = drafts[activeKey] || {};
  const original = (remote || []).find((p) => p.page_key === activeKey) || {};
  const isDirty = JSON.stringify(current) !== JSON.stringify(original);

  const set = (field, val) =>
    setDrafts((prev) => ({ ...prev, [activeKey]: { ...prev[activeKey], [field]: val } }));

  const handleDiscard = () =>
    setDrafts((prev) => ({ ...prev, [activeKey]: original }));

  const enCount = (current.content_en || "").length;
  const arCount = (current.content_ar || "").length;

  return (
    <SectionCard
      id="legal-editor"
      title="Legal pages"
      subtitle="Terms of use and privacy policy displayed at checkout and in the footer"
      saveLabel="Save legal"
      onSave={() => save(current)}
      onDiscard={handleDiscard}
      saving={saving}
      isDirty={isDirty}
    >
      {/* Tab Switcher */}
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

      {/* EN Content */}
      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor={`legal-en-${activeKey}`}>
            {TABS.find((t) => t.key === activeKey)?.label.toUpperCase()}
            <span className={styles.badgeEn} aria-hidden="true">EN</span>
          </label>
          <span className={styles.warningBadge}>Displayed at checkout</span>
        </div>
        <textarea
          id={`legal-en-${activeKey}`}
          className={styles.textarea}
          value={current.content_en || ""}
          onChange={(e) => set("content_en", e.target.value)}
          rows={10}
          dir="ltr"
          placeholder="Enter terms/policy in English…"
        />
        <p className={styles.charCount}>{enCount.toLocaleString()} characters</p>
      </div>

      {/* AR Content */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor={`legal-ar-${activeKey}`}>
          {TABS.find((t) => t.key === activeKey)?.label.toUpperCase()}
          <span className={styles.badgeAr} aria-hidden="true">AR</span>
        </label>
        <textarea
          id={`legal-ar-${activeKey}`}
          className={styles.textarea}
          value={current.content_ar || ""}
          onChange={(e) => set("content_ar", e.target.value)}
          rows={8}
          dir="rtl"
          placeholder="أدخل الشروط/السياسة بالعربية…"
        />
        <p className={styles.charCount}>{arCount.toLocaleString()} characters</p>
      </div>

      <p className={styles.footerHint}>
        Plain text only. Line breaks are preserved. HTML is stripped on save.
      </p>
    </SectionCard>
  );
};

export default LegalEditor;

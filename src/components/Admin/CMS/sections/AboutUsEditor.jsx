import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import { useAboutUsSections, useAboutStats, useUpsertAboutUs } from "../hooks/cmsHooks";
import { DEFAULT_ABOUT_SECTIONS, DEFAULT_ABOUT_STATS } from "../config/defaults";
import styles from "./AboutUsEditor.module.css";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

const AboutUsEditor = () => {
  const { t } = useTranslation();
  const { data: remoteSections, isLoading: loadingSections } = useAboutUsSections();
  const { data: remoteStats, isLoading: loadingStats } = useAboutStats();
  const { mutate: save, isPending: saving } = useUpsertAboutUs();

  const [sections, setSections] = useState(null);
  const [stats, setStats] = useState(null);
  const [expanded, setExpanded] = useState({ hero: true }); // hero open by default

  // When DB data arrives (even as empty arrays), initialise with defaults as fallback
  useEffect(() => {
    if (loadingSections) return;
    setSections(
      remoteSections && remoteSections.length > 0
        ? remoteSections
        : DEFAULT_ABOUT_SECTIONS
    );
  }, [remoteSections, loadingSections]);

  useEffect(() => {
    if (loadingStats) return;
    setStats(
      remoteStats && remoteStats.length > 0
        ? remoteStats
        : DEFAULT_ABOUT_STATS
    );
  }, [remoteStats, loadingStats]);

  if (loadingSections || loadingStats || !sections || !stats) {
    return (
      <div className={styles.skeletonWrap} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <Skeleton variant="rectangular" width="100%" height={80} style={{ borderRadius: 12 }} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={200} style={{ borderRadius: 8 }} />
      </div>
    );
  }

  const isDirty =
    JSON.stringify(sections) !== JSON.stringify(remoteSections) ||
    JSON.stringify(stats) !== JSON.stringify(remoteStats);

  const updateSection = (key, field, val) =>
    setSections((prev) => prev.map((s) => s.section_key === key ? { ...s, [field]: val } : s));

  const updateStat = (statKey, field, val) =>
    setStats((prev) => prev.map((s) => s.stat_key === statKey ? { ...s, [field]: val } : s));

  const handleSave = () => save({ sections, stats });
  const handleDiscard = () => {
    setSections(remoteSections?.length ? remoteSections : DEFAULT_ABOUT_SECTIONS);
    setStats(remoteStats?.length ? remoteStats : DEFAULT_ABOUT_STATS);
  };

  const handleResetToDefault = () => {
    setSections(DEFAULT_ABOUT_SECTIONS);
    setStats(DEFAULT_ABOUT_STATS);
  };

  return (
    <SectionCard
      id="about-us-editor"
      title={t("admin.cms.about.title", "About Us Content")}
      subtitle={t("admin.cms.about.subtitle", "Manage the main content blocks on the About Us page")}
      saveLabel={t("admin.cms.common.save", "Save changes")}
      onSave={handleSave}
      onDiscard={handleDiscard}
      onResetToDefault={handleResetToDefault}
      saving={saving}
      isDirty={isDirty}
    >
      {/* ── Stats Bar ─────────────────────────────────────────────── */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <span className={styles.blockLabel}>{t("admin.cms.about.stats_title", "Key Statistics")}</span>
          <span className={styles.liveBadge}>{t("admin.cms.footer.live_preview", "Live Storefront Preview")}</span>
        </div>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.stat_key} className={styles.statCard}>
              <p className={styles.statKey}>{stat.stat_key.replace(/_/g, " ").toUpperCase()}</p>
              <input
                className={styles.statValueInput}
                value={stat.value ?? ""}
                onChange={(e) => updateStat(stat.stat_key, "value", e.target.value)}
                placeholder="500+"
              />
              <div className={styles.statLabelRow}>
                <input
                  className={styles.statLabelInput}
                  value={stat.label_en ?? ""}
                  onChange={(e) => updateStat(stat.stat_key, "label_en", e.target.value)}
                  placeholder={t("admin.cms.about.stat_label_en", "Label (EN)")}
                  dir="ltr"
                />
                <input
                  className={`${styles.statLabelInput} ${styles.rtl}`}
                  value={stat.label_ar ?? ""}
                  onChange={(e) => updateStat(stat.stat_key, "label_ar", e.target.value)}
                  placeholder={t("admin.cms.about.stat_label_ar", "Label (AR)")}
                  dir="rtl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Content Sections ───────────────────────────────────────── */}
      <div className={styles.block}>
        <span className={styles.blockLabel}>{t("admin.cms.about.add_section", "Add Section").replace("Add Section", "SECTIONS")}</span>
        <div className={styles.sectionsList}>
          {sections
            .slice()
            .sort((a, b) => a.display_order - b.display_order)
            .map((sec) => {
              const isOpen = expanded[sec.section_key];
              return (
                <div key={sec.section_key} className={styles.collapsible}>
                  <button
                    className={styles.collapseHeader}
                    onClick={() => setExpanded((p) => ({ ...p, [sec.section_key]: !isOpen }))}
                  >
                    <div className={styles.collapseHeaderLeft}>
                      <code className={styles.secKey}>{sec.section_key}</code>
                      <span className={styles.secTitle}>{sec.title_en || "—"}</span>
                    </div>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {isOpen && (
                    <div className={styles.collapseBody}>
                      {sec.section_key === "hero" && (
                        <p className={styles.heroHint}>ℹ️ This is the large headline at the top of the About Us page.</p>
                      )}
                      <BilingualField
                        label={t("admin.cms.about.section_title_en", "Title (EN)").replace(" (EN)", "")}
                        valueEn={sec.title_en}
                        valueAr={sec.title_ar}
                        onChangeEn={(v) => updateSection(sec.section_key, "title_en", v)}
                        onChangeAr={(v) => updateSection(sec.section_key, "title_ar", v)}
                        placeholderEn={t("admin.cms.about.section_title_en", "Title (EN)")}
                        placeholderAr={t("admin.cms.about.section_title_ar", "Title (AR)")}
                      />
                      {sec.section_key !== "hero" && (
                        <BilingualField
                          label={t("admin.cms.about.section_content_en", "Content (EN)").replace(" (EN)", "")}
                          valueEn={sec.body_en}
                          valueAr={sec.body_ar}
                          onChangeEn={(v) => updateSection(sec.section_key, "body_en", v)}
                          onChangeAr={(v) => updateSection(sec.section_key, "body_ar", v)}
                          multiline
                          rows={4}
                          placeholderEn={t("admin.cms.about.section_content_en", "Content (EN)")}
                          placeholderAr={t("admin.cms.about.section_content_ar", "Content (AR)")}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </SectionCard>
  );
};

export default AboutUsEditor;

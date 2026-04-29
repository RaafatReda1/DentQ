import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import { useAboutUsSections, useAboutStats, useUpsertAboutUs } from "../hooks/cmsHooks";
import { DEFAULT_ABOUT_SECTIONS, DEFAULT_ABOUT_STATS } from "../config/defaults";
import styles from "./AboutUsEditor.module.css";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";

const AboutUsEditor = () => {
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
      <div className={styles.loadingWrap}>
        <div className={styles.loadingDots}>
          <span /><span /><span />
        </div>
        <p>Loading About Us data…</p>
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
      title="About us page"
      subtitle="Mission, how it works, commitment sections and stats bar"
      saveLabel="Save about us"
      onSave={handleSave}
      onDiscard={handleDiscard}
      saving={saving}
      isDirty={isDirty}
      headerAction={
        <button className={styles.globalResetBtn} onClick={handleResetToDefault} title="Reset all settings to defaults">
          <RotateCcw size={13} /> Reset to defaults
        </button>
      }
    >
      {/* ── Stats Bar ─────────────────────────────────────────────── */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <span className={styles.blockLabel}>STATS BAR</span>
          <span className={styles.liveBadge}>Live on storefront</span>
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
                  placeholder="EN label"
                  dir="ltr"
                />
                <input
                  className={`${styles.statLabelInput} ${styles.rtl}`}
                  value={stat.label_ar ?? ""}
                  onChange={(e) => updateStat(stat.stat_key, "label_ar", e.target.value)}
                  placeholder="التسمية"
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
        <span className={styles.blockLabel}>CONTENT SECTIONS</span>
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
                        label="Title"
                        valueEn={sec.title_en}
                        valueAr={sec.title_ar}
                        onChangeEn={(v) => updateSection(sec.section_key, "title_en", v)}
                        onChangeAr={(v) => updateSection(sec.section_key, "title_ar", v)}
                        placeholderEn="Section title in English"
                        placeholderAr="عنوان القسم بالعربية"
                      />
                      {sec.section_key !== "hero" && (
                        <BilingualField
                          label="Body text"
                          valueEn={sec.body_en}
                          valueAr={sec.body_ar}
                          onChangeEn={(v) => updateSection(sec.section_key, "body_en", v)}
                          onChangeAr={(v) => updateSection(sec.section_key, "body_ar", v)}
                          multiline
                          rows={4}
                          placeholderEn="Section body in English"
                          placeholderAr="نص القسم بالعربية"
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

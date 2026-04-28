import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import { useAboutUsSections, useAboutStats, useUpsertAboutUs } from "../hooks/cmsHooks";
import styles from "./AboutUsEditor.module.css";
import { ChevronDown, ChevronRight } from "lucide-react";

const AboutUsEditor = () => {
  const { data: remoteSections } = useAboutUsSections();
  const { data: remoteStats } = useAboutStats();
  const { mutate: save, isPending: saving } = useUpsertAboutUs();

  const [sections, setSections] = useState(null);
  const [stats, setStats] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => { if (remoteSections) setSections(remoteSections); }, [remoteSections]);
  useEffect(() => { if (remoteStats) setStats(remoteStats); }, [remoteStats]);

  if (!sections || !stats) return <div className={styles.loading}>Loading About Us data…</div>;

  const isDirty =
    JSON.stringify(sections) !== JSON.stringify(remoteSections) ||
    JSON.stringify(stats) !== JSON.stringify(remoteStats);

  const updateSection = (key, field, val) =>
    setSections((prev) => prev.map((s) => s.section_key === key ? { ...s, [field]: val } : s));

  const updateStat = (statKey, field, val) =>
    setStats((prev) => prev.map((s) => s.stat_key === statKey ? { ...s, [field]: val } : s));

  const handleSave = () => save({ sections, stats });
  const handleDiscard = () => { setSections(remoteSections); setStats(remoteStats); };

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
    >
      {/* Stats Bar */}
      <div className={styles.statsBlock}>
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
                value={stat.value}
                onChange={(e) => updateStat(stat.stat_key, "value", e.target.value)}
                placeholder="500+"
              />
              <div className={styles.statLabelRow}>
                <input
                  className={styles.statLabelInput}
                  value={stat.label_en}
                  onChange={(e) => updateStat(stat.stat_key, "label_en", e.target.value)}
                  placeholder="EN label"
                />
                <input
                  className={`${styles.statLabelInput} ${styles.rtl}`}
                  value={stat.label_ar}
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

      {/* Content Sections */}
      <div className={styles.sectionsBlock}>
        <span className={styles.blockLabel}>CONTENT SECTIONS</span>
        <div className={styles.sectionsList}>
          {sections.map((sec) => {
            const isOpen = expanded[sec.section_key];
            return (
              <div key={sec.section_key} className={styles.collapsible}>
                <button
                  className={styles.collapseHeader}
                  onClick={() => setExpanded((p) => ({ ...p, [sec.section_key]: !isOpen }))}
                >
                  <div>
                    <code className={styles.secKey}>{sec.section_key}</code>
                    <span className={styles.secTitle}>{sec.title_en || "—"}</span>
                  </div>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isOpen && (
                  <div className={styles.collapseBody}>
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
                    {sec.section_key === "hero" && (
                      <p className={styles.heroHint}>ℹ️ This is the large headline at the top of the About Us page.</p>
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

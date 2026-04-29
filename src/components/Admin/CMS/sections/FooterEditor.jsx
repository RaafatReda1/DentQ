import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import { useFooter, useUpsertFooter, useNavItems } from "../hooks/cmsHooks";
import { useLogo } from "../../../../utils/LogoContext";
import { getSocialIcon } from "../../../Client/Products/ClientProductsPreview/Footer/FooterActions";
import { DEFAULT_FOOTER } from "../config/defaults";
import styles from "./FooterEditor.module.css";
import { Plus, X, Eye, RotateCcw } from "lucide-react";

// ── Live Preview Component ──────────────────────────────────────────────────
const FooterPreview = ({ draft, navItems, logoUrl }) => {
  // Group nav items
  const groupedNav = (navItems || []).reduce((acc, item) => {
    if (!acc[item.section_key]) acc[item.section_key] = [];
    acc[item.section_key].push(item);
    return acc;
  }, {});

  const columns = Object.values(groupedNav).map(items => items.sort((a, b) => a.item_order - b.item_order));
  const col1 = columns[0] || [];
  const col2 = columns[1] || [];

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <Eye size={14} />
        <span>Live Storefront Preview</span>
      </div>
      <div className={styles.previewBox}>
        <div className={styles.previewGrid}>
          {/* Logo Column */}
          <div className={styles.previewColLogo}>
            <img src={logoUrl || '/logo.png'} alt="DentQ" className={styles.previewLogo} />
            <p className={styles.previewSlogan}>{draft.slogan_en || "Egypt's trusted dental supply platform"}</p>
            <div className={styles.previewSocials}>
              {draft.Links.map((link, i) => {
                const Icon = getSocialIcon(link.url);
                return (
                  <div key={i} className={styles.previewSocialIcon}>
                    <Icon size={16} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className={styles.previewCol}>
            <h3 className={styles.previewColTitle}>{col1[0]?.section_title_en || "Products"}</h3>
            <div className={styles.previewLinks}>
              {col1.map((link, i) => <span key={i} className={styles.previewLink}>{link.item_label_en}</span>)}
            </div>
          </div>

          {/* Nav Column 2 */}
          <div className={styles.previewCol}>
            <h3 className={styles.previewColTitle}>{col2[0]?.section_title_en || "Company"}</h3>
            <div className={styles.previewLinks}>
              {col2.map((link, i) => <span key={i} className={styles.previewLink}>{link.item_label_en}</span>)}
            </div>
          </div>

          {/* Nav Column 3 (Static Contact) */}
          <div className={styles.previewCol}>
            <h3 className={styles.previewColTitle}>Contact us</h3>
            <div className={styles.previewLinks}>
              <span className={styles.previewLink}>hello@dentq.com</span>
              <span className={styles.previewLink}>+20 100 123 4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── FooterEditor ─────────────────────────────────────────────────────────────
const FooterEditor = () => {
  const { data: remote, isLoading } = useFooter();
  const { data: navItems } = useNavItems();
  const { logoUrl } = useLogo();
  const { mutate: save, isPending: saving } = useUpsertFooter();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (remote) {
        setDraft({ ...remote, Links: remote.Links || [] });
      } else {
        setDraft({ ...DEFAULT_FOOTER });
      }
    }
  }, [remote, isLoading]);

  if (isLoading || !draft) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingDots}><span /><span /><span /></div>
        <p>Loading footer settings…</p>
      </div>
    );
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(remote ? { ...remote, Links: remote.Links || [] } : DEFAULT_FOOTER);
  const set = (key, val) => setDraft((p) => ({ ...p, [key]: val }));

  const handleSave = () => save({ id: draft.id, slogan_en: draft.slogan_en, slogan_ar: draft.slogan_ar, Links: draft.Links });
  const handleDiscard = () => setDraft(remote ? { ...remote, Links: remote.Links || [] } : { ...DEFAULT_FOOTER });
  
  const handleResetToDefault = () => {
    setDraft({ ...DEFAULT_FOOTER });
  };

  const updateLink = (i, url) => {
    const links = [...draft.Links];
    links[i] = { url, platform: "link" };
    set("Links", links);
  };
  const removeLink = (i) => set("Links", draft.Links.filter((_, idx) => idx !== i));
  const addLink = () => set("Links", [...draft.Links, { url: "", platform: "link" }]);

  return (
    <SectionCard
      id="footer-editor"
      title="Footer brand & socials"
      subtitle="Slogans and social links displayed in the storefront footer"
      saveLabel="Save footer"
      onSave={handleSave}
      onDiscard={handleDiscard}
      saving={saving}
      isDirty={isDirty}
    >
      <FooterPreview draft={draft} navItems={navItems} logoUrl={logoUrl} />

      <hr className={styles.divider} />

      <BilingualField
        label="Footer Slogan"
        valueEn={draft.slogan_en}
        valueAr={draft.slogan_ar}
        onChangeEn={(v) => set("slogan_en", v)}
        onChangeAr={(v) => set("slogan_ar", v)}
        placeholderEn="Egypt's trusted dental supply platform"
        placeholderAr="شريكك الموثوق لمستلزمات الأسنان"
      />

      {/* Social Links */}
      <div className={styles.linksSection}>
        <div className={styles.linksHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <span className={styles.label}>SOCIAL MEDIA LINKS</span>
            <span className={styles.autoBadge}>Auto-detects icon from URL</span>
          </div>
          <button className={styles.resetBtn} onClick={handleResetToDefault} title="Reset to default footer settings">
            <RotateCcw size={13} /> Reset to defaults
          </button>
        </div>

        <div className={styles.linksList}>
          {draft.Links.map((link, i) => {
            const Icon = getSocialIcon(link.url);
            return (
              <div key={i} className={styles.linkRow}>
                <div className={styles.platformPill} title="Social Link">
                  <Icon size={15} />
                </div>
                <input
                  className={styles.linkInput}
                  value={link.url}
                  onChange={(e) => updateLink(i, e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
                <button className={styles.removeBtn} onClick={() => removeLink(i)} title="Remove">
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>

        <button className={styles.addBtn} onClick={addLink}>
          <Plus size={14} /> Add new social profile
        </button>
      </div>
    </SectionCard>
  );
};

export default FooterEditor;

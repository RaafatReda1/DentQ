import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import { useFooter, useUpsertFooter, useNavItems } from "../hooks/cmsHooks";
import { useLogo } from "../../../../utils/LogoContext";
import { getSocialIcon } from "../../../Client/Products/ClientProductsPreview/Footer/FooterActions";
import { getIconByKey } from "../../../../utils/IconRegistry";
import { DEFAULT_FOOTER } from "../config/defaults";
import IconPickerModal from "../components/IconPickerModal";
import styles from "./FooterEditor.module.css";
import { Plus, X, Eye } from "lucide-react";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

// ── Live Preview Component ──────────────────────────────────────────────────
const FooterPreview = ({ draft, navItems, logoUrl }) => {
  const { t } = useTranslation();
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
        <span>{t("admin.cms.footer.live_preview", "Live Storefront Preview")}</span>
      </div>
      <div className={styles.previewBox}>
        <div className={styles.previewGrid}>
          {/* Logo Column */}
          <div className={styles.previewColLogo}>
            <img src={logoUrl || '/logo.png'} alt="DentQ" className={styles.previewLogo} />
            <p className={styles.previewSlogan}>{draft.slogan_en || "Egypt's trusted dental supply platform"}</p>
            <div className={styles.previewSocials}>
              {draft.Links.map((link, i) => {
                const Icon = getIconByKey(link.iconKey) || getSocialIcon(link.url);
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
  const { t } = useTranslation();
  const { data: remote, isLoading } = useFooter();
  const { data: navItems } = useNavItems();
  const { logoUrl } = useLogo();
  const { mutate: save, isPending: saving } = useUpsertFooter();
  const [draft, setDraft] = useState(null);
  const [pickerOpenFor, setPickerOpenFor] = useState(null);

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
      <div className={styles.skeletonWrap} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <Skeleton variant="rectangular" width="100%" height={250} style={{ borderRadius: 12 }} />
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={60} style={{ borderRadius: 8 }} />
        <Skeleton variant="rectangular" width="100%" height={60} style={{ borderRadius: 8 }} />
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

  const updateLink = (i, field, value) => {
    const links = [...draft.Links];
    links[i] = { ...links[i], [field]: value };
    set("Links", links);
  };
  const removeLink = (i) => set("Links", draft.Links.filter((_, idx) => idx !== i));
  const addLink = () => set("Links", [...draft.Links, { url: "", platform: "link", iconKey: null }]);

  return (
    <SectionCard
      id="footer-editor"
      title={t("admin.cms.footer.title", "Footer brand & socials")}
      subtitle={t("admin.cms.footer.subtitle", "Slogans and social links displayed in the storefront footer")}
      saveLabel={t("admin.cms.common.save", "Save changes")}
      onSave={handleSave}
      onDiscard={handleDiscard}
      onResetToDefault={handleResetToDefault}
      saving={saving}
      isDirty={isDirty}
    >
      <FooterPreview draft={draft} navItems={navItems} logoUrl={logoUrl} />

      <hr className={styles.divider} />

      <BilingualField
        label={t("admin.cms.footer.slogan", "Footer Slogan")}
        valueEn={draft.slogan_en}
        valueAr={draft.slogan_ar}
        onChangeEn={(v) => set("slogan_en", v)}
        onChangeAr={(v) => set("slogan_ar", v)}
        placeholderEn={t("admin.cms.footer.slogan_en_ph", "Egypt's trusted dental supply platform")}
        placeholderAr={t("admin.cms.footer.slogan_ar_ph", "شريكك الموثوق لمستلزمات الأسنان")}
      />

      {/* Social Links */}
      <div className={styles.linksSection}>
        <div className={styles.linksHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <span className={styles.label}>{t("admin.cms.footer.social_links", "SOCIAL MEDIA LINKS")}</span>
            <span className={styles.autoBadge}>{t("admin.cms.footer.auto_detect", "Auto-detects icon from URL")}</span>
          </div>
        </div>

        <div className={styles.linksList}>
          {draft.Links.map((link, i) => {
            const Icon = getIconByKey(link.iconKey) || getSocialIcon(link.url);
            return (
              <div key={i} className={styles.linkRow}>
                <button
                  className={`${styles.platformPill} ${styles.clickablePill}`}
                  onClick={() => setPickerOpenFor(i)}
                  title={t("admin.cms.footer.click_icon", "Click to select specific icon")}
                >
                  <Icon size={15} />
                </button>
                <input
                  className={styles.linkInput}
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
                <button className={styles.removeBtn} onClick={() => removeLink(i)} title={t("admin.cms.common.remove", "Remove")}>
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>

        <button className={styles.addBtn} onClick={addLink}>
          <Plus size={14} /> {t("admin.cms.footer.add_social", "Add new social profile")}
        </button>
      </div>

      {pickerOpenFor !== null && (
        <IconPickerModal
          isOpen={true}
          onClose={() => setPickerOpenFor(null)}
          selectedKey={draft.Links[pickerOpenFor]?.iconKey}
          onSelect={(key) => updateLink(pickerOpenFor, "iconKey", key)}
        />
      )}
    </SectionCard>
  );
};

export default FooterEditor;

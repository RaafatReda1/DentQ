import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import { useFooter, useUpsertFooter } from "../hooks/cmsHooks";
import styles from "./FooterEditor.module.css";
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Link, Plus, X } from "lucide-react";

// ── Platform detection ──────────────────────────────────────────────────────
const detectPlatform = (url = "") => {
  if (url.includes("facebook.com")) return "facebook";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("wa.me") || url.includes("whatsapp")) return "whatsapp";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("youtube.com")) return "youtube";
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  return "link";
};

const PLATFORM_META = {
  facebook:  { label: "Facebook",  color: "#1877F2", bg: "#EBF5FF" },
  instagram: { label: "Instagram", color: "#E1306C", bg: "#FFF0F5" },
  whatsapp:  { label: "WhatsApp",  color: "#25D366", bg: "#EDFDF5" },
  tiktok:    { label: "TikTok",    color: "#010101", bg: "#F3F3F3" },
  youtube:   { label: "YouTube",   color: "#FF0000", bg: "#FFF5F5" },
  linkedin:  { label: "LinkedIn",  color: "#0A66C2", bg: "#EBF4FF" },
  twitter:   { label: "Twitter/X", color: "#1DA1F2", bg: "#EBF8FF" },
  link:      { label: "Website",   color: "#64748b", bg: "#F1F5F9" },
};

const PlatformIcon = ({ platform, size = 16 }) => {
  const iconProps = { size };
  const icons = { facebook: Facebook, instagram: Instagram, youtube: Youtube, linkedin: Linkedin, twitter: Twitter };
  const Icon = icons[platform] || Link;
  return <Icon {...iconProps} />;
};

// ── FooterEditor ─────────────────────────────────────────────────────────────
const FooterEditor = () => {
  const { data: remote } = useFooter();
  const { mutate: save, isPending: saving } = useUpsertFooter();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (remote) setDraft({ ...remote, Links: remote.Links || [] });
  }, [remote]);

  if (!draft) return <div className={styles.loading}>Loading footer settings…</div>;

  const isDirty = JSON.stringify(draft) !== JSON.stringify({ ...remote, Links: remote?.Links || [] });
  const set = (key, val) => setDraft((p) => ({ ...p, [key]: val }));

  const handleSave = () => save({ id: draft.id, slogan_en: draft.slogan_en, slogan_ar: draft.slogan_ar, Links: draft.Links });
  const handleDiscard = () => setDraft({ ...remote, Links: remote.Links || [] });

  const updateLink = (i, url) => {
    const links = [...draft.Links];
    links[i] = { url, platform: detectPlatform(url) };
    set("Links", links);
  };
  const removeLink = (i) => set("Links", draft.Links.filter((_, idx) => idx !== i));
  const addLink = () => set("Links", [...draft.Links, { url: "", platform: "link" }]);

  return (
    <SectionCard
      id="footer-editor"
      title="Footer content"
      subtitle="Slogans and social links displayed in the site footer"
      saveLabel="Save footer"
      onSave={handleSave}
      onDiscard={handleDiscard}
      saving={saving}
      isDirty={isDirty}
    >
      <BilingualField
        label="Slogan"
        valueEn={draft.slogan_en}
        valueAr={draft.slogan_ar}
        onChangeEn={(v) => set("slogan_en", v)}
        onChangeAr={(v) => set("slogan_ar", v)}
        placeholderEn="Egypt's trusted dental supply platform"
        placeholderAr="شريكك الموثوق لمستلزمات الأسنان"
      />

      <hr className={styles.divider} />

      {/* Social Links */}
      <div className={styles.linksSection}>
        <div className={styles.linksHeader}>
          <span className={styles.label}>SOCIAL LINKS</span>
          <span className={styles.autoBadge}>Auto-detects icon from URL</span>
        </div>

        <div className={styles.linksList}>
          {draft.Links.map((link, i) => {
            const meta = PLATFORM_META[link.platform] || PLATFORM_META.link;
            return (
              <div key={i} className={styles.linkRow}>
                <div className={styles.platformPill} style={{ background: meta.bg, color: meta.color }}>
                  <PlatformIcon platform={link.platform} size={14} />
                </div>
                <input
                  className={styles.linkInput}
                  value={link.url}
                  onChange={(e) => updateLink(i, e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
                <button className={styles.removeBtn} onClick={() => removeLink(i)} title="Remove">
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>

        <button className={styles.addBtn} onClick={addLink}>
          <Plus size={14} /> Add social link
        </button>
      </div>
    </SectionCard>
  );
};

export default FooterEditor;

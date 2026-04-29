import React from "react";
import { Plus, X } from "lucide-react";
import { getSocialIcon } from "../../../Client/Products/ClientProductsPreview/Footer/FooterActions";
import { getIconByKey } from "../../../../utils/IconRegistry";

const FooterLinks = ({ draft, set, updateLink, setPickerOpenFor, styles, t }) => {
  return (
    <div className={styles.linksSection}>
      <div className={styles.linksHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <span className={styles.label}>{t("admin.cms.footer.social_links")}</span>
          <span className={styles.autoBadge}>{t("admin.cms.footer.auto_detect")}</span>
        </div>
      </div>
      <div className={styles.linksList}>
        {draft.Links.map((link, i) => {
          const Icon = getIconByKey(link.iconKey) || getSocialIcon(link.url);
          return (
            <div key={i} className={styles.linkRow}>
              <button className={styles.platformPill} onClick={() => setPickerOpenFor(i)}><Icon size={15} /></button>
              <input className={styles.linkInput} value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} placeholder="https://..." dir="ltr" />
              <button className={styles.removeBtn} onClick={() => set("Links", draft.Links.filter((_, idx) => idx !== i))}><X size={15} /></button>
            </div>
          );
        })}
      </div>
      <button className={styles.addBtn} onClick={() => set("Links", [...draft.Links, { url: "", platform: "link", iconKey: null }])}>
        <Plus size={14} /> {t("admin.cms.footer.add_social")}
      </button>
    </div>
  );
};

export default FooterLinks;

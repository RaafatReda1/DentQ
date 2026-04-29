import React from "react";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSocialIcon } from "../../../Client/Products/ClientProductsPreview/Footer/FooterActions";
import { getIconByKey } from "../../../../utils/IconRegistry";
import styles from "../sections/FooterEditor.module.css";

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
            <h3 className={styles.previewColTitle}>{t('admin.cms.contact_us', 'Contact us')}</h3>
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

export default FooterPreview;

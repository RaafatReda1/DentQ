import React from "react";
import { useTranslation } from "react-i18next";
import PromoTableRow from "./PromoTableRow";
import styles from "./PromoTable.module.css";

const PromoTable = ({ codes, isLoading, onEdit, onDelete, onToggleActive, onRenew }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.skeletonRow} style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    );
  }

  if (!codes.length) {
    return (
      <div className={styles.empty}>
        <p>{t("admin.marketing.promo.no_codes", "No promo codes yet. Create your first code!")}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>{t("admin.marketing.promo.col.code", "CODE")}</th>
            <th>{t("admin.marketing.promo.col.type", "TYPE")}</th>
            <th>{t("admin.marketing.promo.col.discount", "DISCOUNT")}</th>
            <th>{t("admin.marketing.promo.col.uses", "USES")}</th>
            <th>{t("admin.marketing.promo.col.expiry", "EXPIRY")}</th>
            <th>{t("admin.marketing.promo.col.status", "STATUS")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <PromoTableRow
              key={code.id}
              code={code}
              onEdit={() => onEdit(code)}
              onDelete={() => onDelete(code.id)}
              onToggleActive={() => onToggleActive(code)}
              onRenew={() => onRenew(code)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromoTable;

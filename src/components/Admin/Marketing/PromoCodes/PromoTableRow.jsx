import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import styles from "./PromoTableRow.module.css";

const getStatus = (code) => {
  const uses = Array.isArray(code.used_by_user_ids) ? code.used_by_user_ids.length : 0;
  if (code.max_uses > 0 && uses >= code.max_uses) return "maxed";
  if (code.expiry && new Date(code.expiry) < new Date()) return "expired";
  if (!code.is_active) return "inactive";
  return "active";
};

const StatusBadge = ({ status, t }) => {
  const map = {
    active:   { label: t("admin.marketing.promo.status.active", "Active"),    cls: "badgeActive" },
    maxed:    { label: t("admin.marketing.promo.status.maxed", "Maxed out"),  cls: "badgeMaxed" },
    expired:  { label: t("admin.marketing.promo.status.expired", "Expired"),  cls: "badgeExpired" },
    inactive: { label: t("admin.marketing.promo.status.inactive", "Inactive"),cls: "badgeInactive" },
  };
  const { label, cls } = map[status] || map.inactive;
  return <span className={`${styles.badge} ${styles[cls]}`}>{label}</span>;
};

const PromoTableRow = ({ code, onEdit, onDelete, onToggleActive, onRenew }) => {
  const { t } = useTranslation();
  const status = getStatus(code);
  const uses = Array.isArray(code.used_by_user_ids) ? code.used_by_user_ids.length : 0;
  const maxUses = code.max_uses || 0;
  const progress = maxUses > 0 ? Math.min((uses / maxUses) * 100, 100) : null;
  const isExpired = status === "expired";

  return (
    <tr className={styles.row}>
      {/* Code */}
      <td className={styles.codeCell}>
        <span className={styles.code}>{code.code}</span>
      </td>

      {/* Type badge */}
      <td>
        <span className={`${styles.typeBadge} ${code.type === "percentage" ? styles.pct : styles.egp}`}>
          {code.type === "percentage" ? "%" : "EGP"}
        </span>
      </td>

      {/* Discount value */}
      <td className={styles.discount}>
        {code.type === "percentage" ? `${code.discount}%` : `${code.discount} EGP`}
      </td>

      {/* Uses + progress bar */}
      <td className={styles.usesCell}>
        <span className={styles.usesText}>
          {uses} / {maxUses === 0 ? "∞" : maxUses}
        </span>
        {progress !== null && (
          <div className={styles.progressTrack}>
            <div
              className={`${styles.progressFill} ${status === "maxed" ? styles.progressGreen : styles.progressBlue}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </td>

      {/* Expiry */}
      <td className={`${styles.expiry} ${isExpired ? styles.expiryRed : ""}`}>
        {code.expiry
          ? `${isExpired ? t("admin.marketing.promo.expired_on", "Expired") : ""} ${format(new Date(code.expiry), "d MMM yyyy")}`
          : "—"}
      </td>

      {/* Status */}
      <td><StatusBadge status={status} t={t} /></td>

      {/* Actions */}
      <td className={styles.actions}>
        {status === "active" && (
          <>
            <button className={styles.btnEdit} onClick={onEdit}>
              {t("admin.marketing.promo.actions.edit", "Edit")}
            </button>
            <button className={styles.btnDeactivate} onClick={onToggleActive}>
              {t("admin.marketing.promo.actions.deactivate", "Deactivate")}
            </button>
          </>
        )}
        {status === "inactive" && (
          <>
            <button className={styles.btnEdit} onClick={onEdit}>
              {t("admin.marketing.promo.actions.edit", "Edit")}
            </button>
            <button className={styles.btnActivate} onClick={onToggleActive}>
              {t("admin.marketing.promo.actions.activate", "Activate")}
            </button>
          </>
        )}
        {status === "maxed" && (
          <>
            <button className={styles.btnEdit} onClick={onEdit}>
              {t("admin.marketing.promo.actions.edit", "Edit")}
            </button>
            <button className={styles.btnDelete} onClick={onDelete}>
              {t("admin.marketing.promo.actions.delete", "Delete")}
            </button>
          </>
        )}
        {status === "expired" && (
          <>
            <button className={styles.btnEdit} onClick={onRenew}>
              {t("admin.marketing.promo.actions.renew", "Renew")}
            </button>
            <button className={styles.btnDelete} onClick={onDelete}>
              {t("admin.marketing.promo.actions.delete", "Delete")}
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default PromoTableRow;

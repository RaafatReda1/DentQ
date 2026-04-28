import React from "react";
import { useTranslation } from "react-i18next";
import { Tag, TrendingUp, DollarSign, Award } from "lucide-react";
import styles from "./PromoStatsBar.module.css";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className={styles.card}>
    <div className={`${styles.iconBox} ${styles[color]}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  </div>
);

const PromoStatsBar = ({ stats, isLoading }) => {
  const { t } = useTranslation();
  if (isLoading) return <div className={styles.skeleton} />;

  const { totalCodes, activeCodes, totalUses, topCode } = stats;

  return (
    <div className={styles.container}>
      <StatCard
        icon={Tag}
        label={t("admin.marketing.promo.stats.total_codes", "Total codes")}
        value={totalCodes}
        sub={`${activeCodes} ${t("admin.marketing.promo.stats.active", "active")}`}
        color="blue"
      />
      <StatCard
        icon={TrendingUp}
        label={t("admin.marketing.promo.stats.total_uses", "Total uses")}
        value={totalUses}
        sub={t("admin.marketing.promo.stats.uses_sub", "All time")}
        color="green"
      />
      <StatCard
        icon={DollarSign}
        label={t("admin.marketing.promo.stats.discount_given", "Discount given")}
        value="—"
        sub={t("admin.marketing.promo.stats.egp_month", "EGP this month")}
        color="amber"
      />
      <StatCard
        icon={Award}
        label={t("admin.marketing.promo.stats.top_code", "Top code")}
        value={topCode?.code || "—"}
        sub={topCode?.uses ? `↑ ${topCode.uses} ${t("admin.marketing.promo.stats.uses", "uses")}` : null}
        color="purple"
      />
    </div>
  );
};

export default PromoStatsBar;

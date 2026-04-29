import React from "react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import styles from "../Dashboard.module.css";

const ListsSection = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.secondaryGrid}>
      {/* Top Products by Revenue */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{t('admin.dashboard.top_by_revenue', 'Top products by revenue')}</h3>
        <div className={styles.rankList}>
          {stats?.topProductsByRevenue.map((p, i) => (
            <div key={p.id} className={styles.rankItem}>
              <div className={styles.rankInfo}>
                <span className={styles.rankNum}>{i + 1}</span>
                <span className={styles.rankName}>{p.name}</span>
              </div>
              <span className={styles.rankVal}>{p.revenue.toLocaleString()} EGP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products by Units */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{t('admin.dashboard.top_by_units', 'Top products by units sold')}</h3>
        <div className={styles.rankList}>
          {stats?.topProductsByUnits.map((p, i) => (
            <div key={p.id} className={styles.rankItem}>
              <div className={styles.rankInfo}>
                <span className={styles.rankNum}>{i + 1}</span>
                <span className={styles.rankName}>{p.name}</span>
              </div>
              <span className={styles.rankVal}>{p.units} {t('admin.dashboard.units_label', 'units')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{t('admin.dashboard.recent_activity', 'Recent Activity')}</h3>
        <div className={styles.activityList}>
          {stats?.recentActivity.map((item, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.activityDot} style={{ background: item.type === 'order' ? '#22c55e' : '#3b82f6' }} />
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>{item.title}</div>
                <div className={styles.activitySub}>{item.subtitle}</div>
              </div>
              <div className={styles.activityTime}>{formatDistanceToNow(new Date(item.time), { addSuffix: true })}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListsSection;

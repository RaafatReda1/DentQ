import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import InfoTooltip from "./InfoTooltip";
import styles from "../Dashboard.module.css";

const RecentActivity = ({ stats }) => {
  const { t } = useTranslation();
  if (!stats) return null;

  return (
    <div className={styles.fullGrid}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center' }}>
          {t("admin.dashboard.charts.recent_activity", "Recent activity")}
          <InfoTooltip translationKey="recent_activity" />
        </h3>
        <span className={styles.cardSubtitle}>{t("admin.dashboard.charts.recent_activity_sub", "Live feed — orders, clients, stock")}</span>
        
        <div className={styles.activityList}>
          {stats.recentActivity.map((item, i) => {
            let dotColor = '#374151';
            if (item.status === 'delivered' || item.status === 'shipped' || item.type === 'order') dotColor = '#639922'; // green
            if (item.type === 'client') dotColor = '#378add'; // blue
            if (item.type === 'low_stock') dotColor = '#ef9f27'; // amber
            if (item.type === 'cancelled') dotColor = '#e24b4a'; // red

            return (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityDot} style={{ background: dotColor }} />
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>{item.title}</div>
                  <div className={styles.activitySub}>{item.subtitle}</div>
                </div>
                <div className={styles.activityTime}>
                  {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                </div>
              </div>
            );
          })}
          {stats.recentActivity.length === 0 && (
            <div style={{ fontSize: 13, color: '#6b7280', padding: '12px 0' }}>
              {t("admin.dashboard.labels.no_activity", "No recent activity.")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;

import React from "react";
import styles from "../Dashboard.module.css";

const GeoAndPromo = ({ stats }) => {
  if (!stats) return null;

  const maxGov = Math.max(...(stats.govData.length ? stats.govData.map(g => g.count) : [1]));
  const maxPromo = Math.max(...(stats.promoPerformance.length ? stats.promoPerformance.map(p => p.uses) : [1]));

  return (
    <div className={styles.halfGrid}>
      {/* Orders by Governorate */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Orders by governorate</h3>
        <span className={styles.cardSubtitle}>Top 7 shipping destinations this period</span>
        
        <div style={{ marginTop: 24 }}>
          {stats.govData.map((gov, i) => (
            <div key={i} className={styles.progressRow}>
              <div className={styles.progressLabel}>
                <span style={{ width: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{gov.name}</span>
                <span className={styles.progressLabelValue}>{gov.count.toLocaleString()} orders</span>
              </div>
              <div className={styles.progressBarBg} style={{ height: 6 }}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width: `${(gov.count / maxGov) * 100}%`, background: '#85b7eb' }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code Performance */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Promo code performance</h3>
        <span className={styles.cardSubtitle}>Uses and discount value this period</span>

        {/* Inline Stats */}
        <div className={styles.promoStatsGrid}>
          <div className={styles.promoStatBox}>
            <div className={styles.promoStatVal}>{stats.activePromoCount}</div>
            <div className={styles.promoStatLabel}>Active codes</div>
          </div>
          <div className={styles.promoStatBox}>
            <div className={styles.promoStatVal}>{stats.promoUsageCount.toLocaleString()}</div>
            <div className={styles.promoStatLabel}>Total uses</div>
          </div>
          <div className={styles.promoStatBox}>
            <div className={styles.promoStatVal}>
              {stats.promoDiscountsTotal >= 1000 
                ? `${(stats.promoDiscountsTotal / 1000).toFixed(1)}k` 
                : stats.promoDiscountsTotal.toLocaleString()}
            </div>
            <div className={styles.promoStatLabel}>EGP discounted</div>
          </div>
        </div>

        {/* Ranked List */}
        <div className={styles.rankList}>
          {stats.promoPerformance.map((p, i) => (
            <div key={i} className={styles.progressRow} style={{ marginBottom: 12 }}>
              <div className={styles.progressLabel}>
                <span style={{ fontFamily: 'monospace', fontWeight: 600, width: 80, color: '#111827' }}>{p.code}</span>
                <span className={styles.progressLabelValue}>{p.uses.toLocaleString()} uses</span>
              </div>
              <div className={styles.progressBarBg} style={{ height: 6 }}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width: `${(p.uses / maxPromo) * 100}%`, background: '#85b7eb' }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeoAndPromo;

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from "../Dashboard.module.css";

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const GovAndCategory = ({ stats }) => {
  const maxGov = Math.max(...stats?.govData.map(g => g.count) || [1]);

  return (
    <div className={styles.mainGrid}>
      {/* Orders by Governorate */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Orders by governorate</h3>
        <span className={styles.cardSubtitle}>Top 7 shipping destinations this period</span>
        <div style={{ marginTop: 24 }}>
          {stats?.govData.map((gov, i) => (
            <div key={i} className={styles.progressRow}>
              <div className={styles.progressLabel}>
                <span>{gov.name}</span>
                <span>{gov.count} orders</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${(gov.count / maxGov) * 100}%`, background: COLORS[i % COLORS.length] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories by Revenue Share */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Top categories</h3>
        <span className={styles.cardSubtitle}>Revenue share by category</span>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={stats?.categoryData} innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value">
                {stats?.categoryData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<SimpleTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 12, justifyContent: 'center' }}>
          {stats?.categoryData.slice(0, 4).map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SimpleTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipVal}>{payload[0].name}: {payload[0].value.toLocaleString()} EGP</p>
      </div>
    );
  }
  return null;
};

export default GovAndCategory;

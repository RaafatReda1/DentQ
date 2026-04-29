import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from "../Dashboard.module.css";

const CATEGORY_COLORS = ['#378add', '#639922', '#7f77dd', '#ef9f27', '#e24b4a', '#5dcaa5', '#afa9ec'];

const TopPerformers = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className={styles.secondaryGrid}>
      {/* Top Products by Revenue */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Top products by revenue</h3>
        <span className={styles.cardSubtitle}>Ranked by total sales value</span>
        <div className={styles.rankList}>
          {stats.topProductsByRevenue.map((p, i) => (
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
        <h3 className={styles.cardTitle}>Top products by units sold</h3>
        <span className={styles.cardSubtitle}>Ranked by sales count</span>
        <div className={styles.rankList}>
          {stats.topProductsByUnits.map((p, i) => (
            <div key={p.id} className={styles.rankItem}>
              <div className={styles.rankInfo}>
                <span className={styles.rankNum}>{i + 1}</span>
                <span className={styles.rankName}>{p.name}</span>
              </div>
              <span className={styles.rankVal}>{p.units.toLocaleString()} units</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories by Revenue Share */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 className={styles.cardTitle}>Top categories</h3>
            <span className={styles.cardSubtitle}>Revenue share by category</span>
          </div>
        </div>

        {/* Custom HTML Legend above chart */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: 16 }}>
          {stats.categoryData.slice(0, 4).map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
              <span style={{ fontSize: 12, color: '#4b5563' }}>{cat.name}</span>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={stats.categoryData.slice(0,4)} innerRadius="60%" outerRadius="100%" paddingAngle={0} dataKey="value" stroke="none">
                {stats.categoryData.slice(0,4).map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<SimpleTooltip />} />
            </PieChart>
          </ResponsiveContainer>
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

export default TopPerformers;

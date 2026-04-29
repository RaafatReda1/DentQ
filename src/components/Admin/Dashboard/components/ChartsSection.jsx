import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from "react-i18next";
import InfoTooltip from "./InfoTooltip";
import styles from "../Dashboard.module.css";

const STATUS_COLORS = {
  delivered: '#639922',
  shipped: '#378add',
  paid: '#7f77dd',
  pending: '#ef9f27',
  cancelled: '#e24b4a'
};

const ChartsSection = ({ stats }) => {
  const { t } = useTranslation();
  if (!stats) return null;

  const pieData = Object.entries(stats.statusBreakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), // Basic capitalization, ideally use translation
    statusKey: name,
    value,
    color: STATUS_COLORS[name.toLowerCase()] || '#9ca3af'
  })).sort((a, b) => b.value - a.value);

  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return "0";
    return `${(tickItem / 1000).toFixed(tickItem % 1000 !== 0 ? 1 : 0)}k`;
  };

  return (
    <div className={styles.mainGrid}>
      {/* Revenue Area Chart */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center' }}>
              {t("admin.dashboard.charts.revenue_time", "Revenue over time")}
              <InfoTooltip translationKey="revenue_time" />
            </h3>
            <span className={styles.cardSubtitle}>{t("admin.dashboard.charts.revenue_time_sub", "Daily revenue in EGP")}</span>
          </div>
          {/* Custom HTML Legend */}
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: '#378add', borderRadius: 2 }}></div>
              <span>{t("admin.dashboard.labels.revenue", "Revenue")}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, border: '2px dashed #97c459', borderRadius: 2 }}></div>
              <span>{t("admin.dashboard.labels.profit", "Profit")}</span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={stats.dailyBuckets}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dy={10} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dx={-10} tickFormatter={formatYAxis} />
              <Tooltip content={<CustomTooltip t={t} />} />
              <Line type="monotone" dataKey="revenue" stroke="#378add" strokeWidth={2} dot={false} activeDot={{r: 4}} isAnimationActive={false} />
              <Line type="monotone" dataKey="profit" stroke="#97c459" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={{r: 4}} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Donut */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center' }}>
          {t("admin.dashboard.charts.order_status", "Order status breakdown")}
          <InfoTooltip translationKey="order_status" values={{ val: stats.totalOrders.toLocaleString() }} />
        </h3>
        <span className={styles.cardSubtitle}>{t("admin.dashboard.charts.order_status_sub", "All orders this period")}</span>
        
        <div style={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <ResponsiveContainer width="99%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius="68%" outerRadius="100%" paddingAngle={0} dataKey="value" stroke="none">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<SimpleTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          {pieData.map((item, i) => (
            <div key={i} className={styles.progressRow}>
              <div className={styles.progressLabel}>
                <span style={{ width: 68 }}>{item.name}</span>
                <span className={styles.progressLabelValue}>{item.value}</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${(item.value / stats.totalOrders) * 100}%`, background: item.color, height: 7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipVal} style={{color: '#378add'}}>{t("admin.dashboard.labels.revenue", "Rev")}: {payload[0].value.toLocaleString()} EGP</p>
        <p className={styles.tooltipVal} style={{color: '#97c459'}}>{t("admin.dashboard.labels.profit", "Profit")}: {payload[1].value.toLocaleString()} EGP</p>
      </div>
    );
  }
  return null;
};

const SimpleTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipVal}>{payload[0].name}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default ChartsSection;

import React from "react";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Activity, Tag, AlertCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import InfoTooltip from "./InfoTooltip";
import styles from "../Dashboard.module.css";

const DeltaBadge = ({ value, inverted = false }) => {
  const isPositive = value >= 0;
  const isGood = inverted ? !isPositive : isPositive;
  
  return (
    <div className={`${styles.metricDelta} ${isGood ? styles.deltaPositive : styles.deltaNegative}`}>
      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
};

const Sparkline = ({ data, dataKey, color }) => (
  <div className={styles.sparklineWrapper}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const MetricCards = ({ stats }) => {
  const { t } = useTranslation();
  if (!stats) return null;

  const primaryMetrics = [
    { 
      id: "revenue",
      label: t("admin.dashboard.metrics.revenue", "Total Revenue"), 
      value: `${stats.totalRevenue.toLocaleString()} EGP`, 
      delta: stats.revenueDelta,
      icon: <DollarSign size={20} />, 
      sparkKey: "revenue",
      sparkColor: "#378add", // blue
      tooltipValues: { val: `${stats.totalRevenue.toLocaleString()} EGP`, delta: stats.revenueDelta.toFixed(1) }
    },
    { 
      id: "orders",
      label: t("admin.dashboard.metrics.orders", "Total Orders"), 
      value: stats.totalOrders.toLocaleString(), 
      delta: stats.ordersDelta,
      icon: <ShoppingBag size={20} />, 
      sparkKey: "orders",
      sparkColor: "#639922", // green
      tooltipValues: { val: stats.totalOrders.toLocaleString(), delta: stats.ordersDelta.toFixed(1) }
    },
    { 
      id: "new_clients",
      label: t("admin.dashboard.metrics.new_clients", "New Clients"), 
      value: stats.newClients.toLocaleString(), 
      delta: stats.newClientsDelta,
      icon: <Users size={20} />, 
      sparkKey: "clients",
      sparkColor: "#7f77dd", // purple
      tooltipValues: { val: stats.newClients.toLocaleString(), delta: stats.newClientsDelta.toFixed(1) }
    },
    { 
      id: "aov",
      label: t("admin.dashboard.metrics.aov", "Average Order Value"), 
      value: `${stats.aov.toLocaleString(undefined, {maximumFractionDigits: 0})} EGP`, 
      delta: stats.aovDelta,
      icon: <Activity size={20} />, 
      sparkKey: "aov",
      sparkColor: "#ef9f27", // amber
      tooltipValues: { val: `${stats.aov.toLocaleString(undefined, {maximumFractionDigits: 0})} EGP`, delta: stats.aovDelta.toFixed(1) }
    }
  ];

  const secondaryMetrics = [
    {
      id: "gross_profit",
      label: t("admin.dashboard.metrics.gross_profit", "Gross Profit"),
      value: `${stats.grossProfit.toLocaleString()} EGP`,
      subLabel: t("admin.dashboard.metrics.gross_profit_sub", { margin: stats.profitMargin.toFixed(1) }),
      icon: <TrendingUp size={20} />,
      tooltipValues: { val: `${stats.grossProfit.toLocaleString()} EGP`, margin: stats.profitMargin.toFixed(1) }
    },
    {
      id: "promo_discounts",
      label: t("admin.dashboard.metrics.promo_discounts", "Promo Discounts"),
      value: `${stats.promoDiscounts.toLocaleString()} EGP`,
      subLabel: t("admin.dashboard.metrics.promo_discounts_sub", { rate: stats.promoDiscountRate.toFixed(1) }),
      icon: <Tag size={20} />,
      tooltipValues: { val: `${stats.promoDiscounts.toLocaleString()} EGP`, rate: stats.promoDiscountRate.toFixed(1) }
    },
    {
      id: "pending_orders",
      label: t("admin.dashboard.metrics.pending_orders", "Pending Orders"),
      value: stats.pendingOrders.toLocaleString(),
      subLabel: t("admin.dashboard.metrics.pending_orders_sub", "Needs attention"),
      icon: <AlertCircle size={20} />,
      valColor: "#854f0b", // amber dark
      tooltipValues: { val: stats.pendingOrders.toLocaleString() }
    },
    {
      id: "cancelled_orders",
      label: t("admin.dashboard.metrics.cancelled_orders", "Cancelled Orders"),
      value: stats.cancelledOrders.toLocaleString(),
      subLabel: t("admin.dashboard.metrics.cancelled_orders_sub", { rate: stats.cancelRate.toFixed(1) }),
      icon: <XCircle size={20} />,
      valColor: "#a32d2d", // red dark
      tooltipValues: { val: stats.cancelledOrders.toLocaleString(), rate: stats.cancelRate.toFixed(1) }
    }
  ];

  return (
    <>
      <div className={styles.metricsGrid}>
        {primaryMetrics.map((m, i) => (
          <div key={i} className={`${styles.card} ${styles.metricCard}`}>
            <div className={styles.metricHeader}>
              <div className={styles.metricIcon}>{m.icon}</div>
              <span className={styles.metricLabel}>{m.label}</span>
              <InfoTooltip translationKey={m.id} values={m.tooltipValues} />
            </div>
            <div className={styles.metricValueRow}>
              <div className={styles.metricValue}>{m.value}</div>
              <DeltaBadge value={m.delta} />
            </div>
            <Sparkline data={stats.dailyBuckets} dataKey={m.sparkKey} color={m.sparkColor} />
          </div>
        ))}
      </div>

      <div className={styles.metricsGrid}>
        {secondaryMetrics.map((m, i) => (
          <div key={i} className={`${styles.card} ${styles.metricCard}`} style={{ paddingBottom: 16 }}>
            <div className={styles.metricHeader} style={{ marginBottom: 8 }}>
              <div className={styles.metricIcon}>{m.icon}</div>
              <span className={styles.metricLabel}>{m.label}</span>
              <InfoTooltip translationKey={m.id} values={m.tooltipValues} />
            </div>
            <div className={styles.metricValueRow} style={{ marginBottom: 0 }}>
              <div className={styles.metricValue} style={m.valColor ? { color: m.valColor } : {}}>{m.value}</div>
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{m.subLabel}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MetricCards;

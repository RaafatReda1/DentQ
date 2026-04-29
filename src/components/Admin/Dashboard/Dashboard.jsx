import React from "react";
import { useTranslation } from "react-i18next";
import { useDashboardStats } from "./hooks/useDashboardStats";
import MetricCards from "./components/MetricCards";
import ChartsSection from "./components/ChartsSection";
import TopPerformers from "./components/TopPerformers";
import GeoAndPromo from "./components/GeoAndPromo";
import RecentActivity from "./components/RecentActivity";
import MonthlyChart from "./components/MonthlyChart";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { stats, isLoading, error, dateRange, setDateRange } = useDashboardStats();

  if (error) return <div className={styles.container}>Error loading dashboard: {error.message}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{t("admin.dashboard.title", "Business Overview")}</h1>
          <p className={styles.subtitle}>{t("admin.dashboard.subtitle", "Real-time analytics and performance metrics for DentQ")}</p>
        </div>

        {/* Time Range Selector */}
        <div className={styles.timeRangeSelector}>
          <button 
            className={`${styles.timeRangeBtn} ${dateRange === '7d' ? styles.active : ''}`}
            onClick={() => setDateRange('7d')}
          >
            7d
          </button>
          <button 
            className={`${styles.timeRangeBtn} ${dateRange === '30d' ? styles.active : ''}`}
            onClick={() => setDateRange('30d')}
          >
            30d
          </button>
          <button 
            className={`${styles.timeRangeBtn} ${dateRange === '90d' ? styles.active : ''}`}
            onClick={() => setDateRange('90d')}
          >
            90d
          </button>
          <button 
            className={`${styles.timeRangeBtn} ${dateRange === 'all' ? styles.active : ''}`}
            onClick={() => setDateRange('all')}
          >
            All time
          </button>
        </div>
      </header>

      {isLoading || !stats ? (
        <DashboardSkeleton />
      ) : (
        <>
          <MetricCards stats={stats} />
          <ChartsSection stats={stats} />
          <TopPerformers stats={stats} />
          <GeoAndPromo stats={stats} />
          <RecentActivity stats={stats} />
          <MonthlyChart stats={stats} dateRange={dateRange} />
        </>
      )}
    </div>
  );
};

const DashboardSkeleton = () => (
  <div>
    <div className={styles.metricsGrid}>
      {[1,2,3,4].map(i => <div key={i} className={`${styles.card} ${styles.skeleton}`} style={{height: 120}} />)}
    </div>
    <div className={styles.metricsGrid}>
      {[1,2,3,4].map(i => <div key={i} className={`${styles.card} ${styles.skeleton}`} style={{height: 100}} />)}
    </div>
    <div className={styles.mainGrid}>
      <div className={`${styles.card} ${styles.skeleton}`} style={{height: 350}} />
      <div className={`${styles.card} ${styles.skeleton}`} style={{height: 350}} />
    </div>
  </div>
);

export default Dashboard;

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from "../Dashboard.module.css";

const MonthlyChart = ({ stats, dateRange }) => {
  // Only show for 'all' or '90d'
  if (!stats || (dateRange !== 'all' && dateRange !== '90d')) return null;

  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return "0";
    return `${(tickItem / 1000).toFixed(tickItem % 1000 !== 0 ? 1 : 0)}k`;
  };

  return (
    <div className={styles.fullGrid}>
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 className={styles.cardTitle}>Monthly revenue vs profit — full year</h3>
            <span className={styles.cardSubtitle}>EGP · comparing gross revenue against profit margin per month</span>
          </div>
          {/* Custom HTML Legend */}
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: '#b5d4f4', border: '1px solid #378add', borderRadius: 2 }}></div>
              <span>Revenue</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: '#c0dd97', border: '1px dashed #639922', borderRadius: 2 }}></div>
              <span>Profit</span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={stats.monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 11}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 11}} 
                dx={-10} 
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="revenue" fill="#b5d4f4" stroke="#378add" radius={[4,4,0,0]} />
              <Bar dataKey="profit" fill="#c0dd97" stroke="#639922" strokeDasharray="3 3" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipVal} style={{color: '#378add'}}>Rev: {payload[0].value.toLocaleString()} EGP</p>
        <p className={styles.tooltipVal} style={{color: '#639922'}}>Profit: {payload[1].value.toLocaleString()} EGP</p>
      </div>
    );
  }
  return null;
};

export default MonthlyChart;

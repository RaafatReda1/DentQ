import React, { useMemo } from 'react';
import { useOrdersStore } from '../../store/useOrdersStore';
import styles from './StatsBar.module.css';

const StatsCard = ({ label, value, type, onClick }) => (
    <div onClick={onClick} className={styles.card}>
        <p className={styles.label}>{label}</p>
        <p className={`${styles.value} ${styles[type]}`}>{value}</p>
    </div>
);

const StatsBar = ({ orders = [] }) => {
    const setFilter = useOrdersStore(state => state.setFilter);

    const stats = useMemo(() => {
        const total = orders.length;
        const revenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + Number(o.total_amount) : sum, 0);
        const pending = orders.filter(o => o.status === 'pending').length;
        const shipped = orders.filter(o => o.status === 'shipped').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        return { total, revenue, pending, shipped, cancelled };
    }, [orders]);

    return (
        <div className={styles.container}>
            <StatsCard label="Total Orders" value={stats.total} type="total" onClick={() => setFilter('status', '')} />
            <StatsCard label="Revenue" value={`${stats.revenue.toLocaleString()} EGP`} type="revenue" />
            <StatsCard label="Pending" value={stats.pending} type="pending" onClick={() => setFilter('status', 'pending')} />
            <StatsCard label="Shipped" value={stats.shipped} type="shipped" onClick={() => setFilter('status', 'shipped')} />
            <StatsCard label="Cancelled" value={stats.cancelled} type="cancelled" onClick={() => setFilter('status', 'cancelled')} />
        </div>
    );
};

export default StatsBar;

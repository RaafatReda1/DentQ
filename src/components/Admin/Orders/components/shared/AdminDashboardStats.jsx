import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrdersStore } from '../../store/useOrdersStore';
import { useOrdersQuery } from '../../hooks/useOrdersQuery';
import { useCartsQuery } from '../../hooks/useCartsQuery';
import { TrendingUp, ShoppingCart, Users, Wallet, Target, RefreshCw } from 'lucide-react';
import styles from './AdminDashboardStats.module.css';

const StatCard = ({ label, value, subValue, icon, colorClass, animationDelay }) => (
    <div className={styles.card} style={{ animationDelay }}>
        <div className={styles.cardContent}>
            <div className={`${styles.iconBox} ${styles[colorClass]}`}>{icon}</div>
            <div className={styles.textData}>
                <p className={styles.label}>{label}</p>
                <p className={styles.value}>{value}</p>
                {subValue && <p className={styles.subValue}>{subValue}</p>}
            </div>
        </div>
    </div>
);

const AdminDashboardStats = () => {
    const { t } = useTranslation();
    const { activeView } = useOrdersStore();
    const { orders } = useOrdersQuery();
    const { stats: cartStats } = useCartsQuery();

    const orderMetrics = useMemo(() => {
        const total = orders.length;
        const revenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + Number(o.total_amount) : sum, 0);
        const paid = orders.filter(o => o.status === 'paid').length;
        const successRate = total > 0 ? ((paid / total) * 100).toFixed(1) : 0;
        return { total, revenue, successRate };
    }, [orders]);

    if (activeView === 'carts') {
        const stats = cartStats || {};
        return (
            <div className={styles.container}>
                <StatCard label={t('admin.dashboard.abandoned_carts')} value={stats.totalCarts} subValue={t('admin.dashboard.abandoned_carts_sub', { count: stats.guestCount })} icon={<ShoppingCart size={20} />} colorClass="blue" animationDelay="0.1s" />
                <StatCard label={t('admin.dashboard.potential_revenue')} value={`${(stats.potentialRevenue || 0).toLocaleString()} EGP`} subValue={t('admin.dashboard.potential_revenue_sub')} icon={<Wallet size={20} />} colorClass="gold" animationDelay="0.2s" />
                <StatCard label={t('admin.dashboard.recoverable')} value={stats.recoverable} subValue={t('admin.dashboard.recoverable_sub')} icon={<Target size={20} />} colorClass="green" animationDelay="0.3s" />
                <StatCard label={t('admin.dashboard.user_ratio')} value={`${stats.totalCarts > 0 ? (((stats.totalCarts - stats.guestCount) / stats.totalCarts) * 100).toFixed(0) : 0}%`} subValue={t('admin.dashboard.user_ratio_sub')} icon={<Users size={20} />} colorClass="purple" animationDelay="0.4s" />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <StatCard label={t('admin.dashboard.total_volume')} value={orderMetrics.total} subValue={t('admin.dashboard.total_volume_sub')} icon={<TrendingUp size={20} />} colorClass="blue" animationDelay="0.1s" />
            <StatCard label={t('admin.dashboard.total_revenue')} value={`${orderMetrics.revenue.toLocaleString()} EGP`} subValue={t('admin.dashboard.total_revenue_sub')} icon={<Wallet size={20} />} colorClass="green" animationDelay="0.2s" />
            <StatCard label={t('admin.dashboard.success_rate')} value={`${orderMetrics.successRate}%`} subValue={t('admin.dashboard.success_rate_sub')} icon={<RefreshCw size={20} />} colorClass="gold" animationDelay="0.3s" />
        </div>
    );
};

export default AdminDashboardStats;

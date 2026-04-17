import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StatsBar.module.css';

const StatsBar = ({ categories }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);

    const total = categories.length;
    const roots = categories.filter(c => c.level === 0).length;
    const active = categories.filter(c => c.is_active).length;
    const subcats = total - roots;

    const stats = [
        { label: tp('total') || 'Total Categories', value: total },
        { label: tp('roots') || 'Root Categories', value: roots },
        { label: tp('subs') || 'Sub Categories', value: subcats },
        { label: tp('active') || 'Active', value: active, trend: 'good' }
    ];

    return (
        <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
                <div key={i} className={styles.statCard}>
                    <p className={styles.statLabel}>{stat.label}</p>
                    <h3 className={`${styles.statValue} ${stat.trend ? styles[stat.trend] : ''}`}>{stat.value}</h3>
                </div>
            ))}
        </div>
    );
};

export default StatsBar;

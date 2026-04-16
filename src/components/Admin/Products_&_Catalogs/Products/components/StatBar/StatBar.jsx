import React from 'react';
import { Package, CheckCircle, AlertTriangle, Star, TrendingUp } from 'lucide-react';
import styles from './StatBar.module.css';

/**
 * StatBar — 5 clickable stat cards that show aggregate product data.
 * Clicking a card auto-filters the product list.
 * 
 * Props:
 *   - stats: { total, active, lowStock, featured, avgRating }
 *   - activeFilter (string) — current status filter to highlight active card
 *   - onStatClick(filterKey) callback
 */
const StatBar = ({ stats, activeFilter, onStatClick }) => {
    const cards = [
        {
            key: 'all',
            label: 'Total',
            value: stats.total,
            icon: Package,
            color: '#64748b',
        },
        {
            key: 'active',
            label: 'Active',
            value: stats.active,
            icon: CheckCircle,
            color: '#22c55e',
        },
        {
            key: 'low_stock',
            label: 'Low stock',
            value: stats.lowStock,
            icon: AlertTriangle,
            color: '#f59e0b',
        },
        {
            key: 'featured',
            label: 'Featured',
            value: stats.featured,
            icon: Star,
            color: '#3b82f6',
        },
        {
            key: 'rating',
            label: 'Avg rating',
            value: `${stats.avgRating} ★`,
            icon: TrendingUp,
            color: '#8b5cf6',
            notClickable: true,
        },
    ];

    return (
        <div className={styles.statBar}>
            {cards.map((card) => (
                <button
                    key={card.key}
                    className={`${styles.statCard} ${activeFilter === card.key ? styles.activeCard : ''}`}
                    onClick={() => !card.notClickable && onStatClick(card.key)}
                    style={{ '--stat-color': card.color }}
                    disabled={card.notClickable}
                >
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>{card.label}</span>
                        <card.icon size={16} className={styles.cardIcon} />
                    </div>
                    <span className={styles.cardValue}>{card.value}</span>
                </button>
            ))}
        </div>
    );
};

export default StatBar;

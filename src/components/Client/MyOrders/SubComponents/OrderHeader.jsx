import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronDown } from 'lucide-react';
import { formatDate, getStatusStyle } from '../Actions';
import styles from './OrderHeader.module.css';

const OrderHeader = ({ orderId, createdAt, status, isExpanded, onClick }) => {
    const { t } = useTranslation();

    return (
        <div
            className={styles.orderHeader}
            onClick={onClick}
        >
            <div className={styles.orderMeta}>
                <div className={styles.orderIdRow}>
                    <span className={styles.orderIdLabel}>{t('orders.order_id') || 'Order ID'}</span>
                    <span className={styles.orderId}>#{orderId.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className={styles.orderDate}>
                    <Calendar size={14} className={styles.calendarIcon} />
                    {formatDate(createdAt)}
                </div>
            </div>

            <div className={styles.headerRight}>
                <span className={`${styles.statusBadge} ${getStatusStyle(status, styles)}`}>
                    <span className={styles.statusDot}></span>
                    {t(`status.${status}`) || status}
                </span>
                <ChevronDown
                    size={24}
                    className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                />
            </div>
        </div>
    );
};

export default OrderHeader;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOrdersStore } from '../../store/useOrdersStore';
import StatusBadge from '../shared/StatusBadge';
import OrderCheckbox from '../shared/OrderCheckbox';
import styles from './OrdersMiniList.module.css';

const OrderItemMini = ({ order }) => {
    const { activeOrderId, setActiveOrder, selectedIds, toggleSelect } = useOrdersStore();
    const isActive = activeOrderId === order.id;
    const isSelected = selectedIds.has(order.id);

    return (
        <div 
            onClick={() => setActiveOrder(order.id)}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
        >
            <OrderCheckbox checked={isSelected} onChange={() => toggleSelect(order.id)} />
            <div className={styles.info}>
                <p className={styles.name}>{order.full_name}</p>
                <p className={styles.id}>#{order.id.slice(0, 8)}</p>
            </div>
            <div className={styles.meta}>
                <p className={styles.price}>{Number(order.total_amount).toLocaleString()} EGP</p>
                <div className={styles.statusMini}>
                    <StatusBadge status={order.status} />
                </div>
            </div>
        </div>
    );
};

const OrdersMiniList = ({ orders = [] }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{t('admin.orders.detail.mini_title', 'Order Pipeline')}</h3>
            </div>
            <div className={styles.list}>
                {orders.map(o => <OrderItemMini key={o.id} order={o} />)}
            </div>
        </div>
    );
};

export default OrdersMiniList;

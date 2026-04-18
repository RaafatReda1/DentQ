import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderCheckbox from '../shared/OrderCheckbox';
import StatusBadge from '../shared/StatusBadge';
import OrderItemsPopup from '../shared/OrderItemsPopup';
import { useOrdersStore } from '../../store/useOrdersStore';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import styles from './TableRow.module.css';

const TableRow = ({ order, onStatusChange }) => {
    const { t } = useTranslation();
    const { selectedIds, toggleSelect, setView, setActiveOrder } = useOrdersStore();
    const [showModal, setShowModal] = useState(false);
    const isSelected = selectedIds.has(order.id);

    return (
        <tr className={`${styles.row} ${isSelected ? styles.selected : ''}`}>
            <td className={styles.cell}><OrderCheckbox checked={isSelected} onChange={() => toggleSelect(order.id)} /></td>
            <td className={styles.cell}>
                <div className={styles.idClickable} onClick={() => setShowModal(true)}>
                    <span>#{order.id.slice(0, 8)}...</span>
                </div>
            </td>
            <td className={styles.cell}><div className={styles.name}>{order.full_name}</div><div className={styles.phone}>{order.phone_number}</div></td>
            <td className={`${styles.cell} ${styles.total}`}>{Number(order.total_amount).toLocaleString()} EGP</td>
            <td className={styles.cell}><StatusBadge status={order.status} /></td>
            <td className={`${styles.cell} ${styles.payment}`}>{t(`admin.orders.payments.${order.payment_method}`, order.payment_method)}</td>
            <td className={`${styles.cell} ${styles.date}`}>{format(new Date(order.created_at), 'MMM d, yyyy')}</td>
            <td className={styles.cell}>
                <button onClick={() => { setActiveOrder(order.id); setView('detail'); }} className={styles.viewBtn} title={t('admin.orders.table.view_detail', 'View Detail')}><Eye size={18} /></button>
            </td>
            {showModal && <OrderItemsPopup isOpen={showModal} onClose={() => setShowModal(false)} items={order.Order_items} />}
        </tr>
    );
};

export default TableRow;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Draggable } from '@hello-pangea/dnd';
import { useOrdersStore } from '../../store/useOrdersStore';
import { STATUS_NEXT } from '../../constants/orderStatuses';
import { ArrowRight, GripVertical } from 'lucide-react';
import OrderCheckbox from '../shared/OrderCheckbox';
import OrderItemsPopup from '../shared/OrderItemsPopup';
import styles from './KanbanCard.module.css';

const KanbanCard = ({ order, index, onStatusChange }) => {
    const { t } = useTranslation();
    const { selectedIds, toggleSelect, setView, setActiveOrder } = useOrdersStore();
    const [showModal, setShowModal] = useState(false);
    const isSelected = selectedIds.has(order.id);
    const nextStatus = STATUS_NEXT[order.status];

    return (
        <Draggable draggableId={order.id} index={index}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef} {...provided.draggableProps}
                    className={`${styles.card} ${snapshot.isDragging ? styles.dragging : ''}`}
                >
                    <div className={styles.header}>
                        <OrderCheckbox checked={isSelected} onChange={() => toggleSelect(order.id)}/>
                        <div {...provided.dragHandleProps} className={styles.grip}><GripVertical size={16} /></div>
                    </div>

                    <p className={styles.name}>{order.full_name}</p>
                    <div className={styles.footer}>
                        <span className={styles.price}>{Number(order.total_amount).toLocaleString()} EGP</span>
                    </div>
                    <div className={styles.actions} onClick={e => e.stopPropagation()}>
                        {nextStatus && (
                            <button onClick={() => onStatusChange(order.id, nextStatus)} className={styles.advanceBtn}>
                                {t('admin.orders.kanban.advance', 'Mark as')} {nextStatus} <ArrowRight size={12} />
                            </button>
                        )}
                        <button onClick={() => { setActiveOrder(order.id); setView('detail'); }} className={styles.viewBtn}>
                            {t('admin.orders.kanban.view_order', 'View Order')}
                        </button>
                        <button onClick={() => setShowModal(true)} className={styles.viewBtn}>
                            {t('admin.orders.kanban.view_products', 'View Products')}
                        </button>
                    </div>
                    {showModal && <OrderItemsPopup isOpen={showModal} onClose={() => setShowModal(false)} items={order.Order_items} />}
                </div>
            )}
        </Draggable>
    );
};

export default KanbanCard;

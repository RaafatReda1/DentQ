import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import { getStatusConfig } from '../../constants/orderStatuses';
import styles from './KanbanColumn.module.css';

const KanbanColumn = ({ status, orders = [], onStatusChange }) => {
    const config = getStatusConfig(status);
    const dotColorMap = { pending: '#f59e0b', paid: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };

    return (
        <div className={styles.column}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.dot} style={{backgroundColor: dotColorMap[status]}}></div>
                    <span className={styles.label}>{config.label}</span>
                </div>
                <span className={styles.count}>{orders.length}</span>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef} {...provided.droppableProps}
                        className={`${styles.list} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
                    >
                        {orders.map((order, index) => (
                            <KanbanCard key={order.id} order={order} index={index} onStatusChange={onStatusChange} />
                        ))}
                        {provided.placeholder}
                        {orders.length === 0 && <div className={styles.empty}>No {status} orders</div>}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;

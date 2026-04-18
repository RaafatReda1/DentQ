import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { ORDER_STATUSES } from '../../constants/orderStatuses';
import { useOrderMutations } from '../../hooks/useOrderMutations';
import styles from './KanbanView.module.css';

const KanbanView = ({ orders = [] }) => {
    const { mutate: updateStatus } = useOrderMutations();

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || destination.droppableId === source.droppableId) return;
        updateStatus({ id: draggableId, status: destination.droppableId });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.container}>
                {ORDER_STATUSES.map(status => (
                    <KanbanColumn 
                        key={status.id} 
                        status={status.id} 
                        orders={orders.filter(o => o.status === status.id)}
                        onStatusChange={(id, s) => updateStatus({ id, status: s })}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanView;

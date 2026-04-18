import React from 'react';
import { useOrdersStore } from '../store/useOrdersStore';
import TableView from './TableView/TableView';
import KanbanView from './KanbanView/KanbanView';
import DetailView from './DetailView/DetailView';
import CartsView from './CartsView/CartsView';
import styles from './ViewRenderer.module.css';

/**
 * Switcher component for the four main order management views.
 */
const ViewRenderer = ({ orders = [], isLoading }) => {
    const activeView = useOrdersStore(state => state.activeView);

    if (isLoading) {
        return <div className={styles.loading}>Synchronizing Data...</div>;
    }

    if (orders.length === 0 && activeView !== 'carts') {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyText}>No orders matching your filters were found.</p>
            </div>
        );
    }

    switch (activeView) {
        case 'kanban': return <KanbanView orders={orders} />;
        case 'detail': return <DetailView orders={orders} />;
        case 'carts':  return <CartsView />;
        case 'table':
        default: return <TableView orders={orders} />;
    }
};

export default ViewRenderer;

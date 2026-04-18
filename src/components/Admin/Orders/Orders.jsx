import React from 'react';
import AdminDashboardStats from './components/shared/AdminDashboardStats';
import Toolbar from './components/Toolbar/Toolbar';
import ViewRenderer from './components/ViewRenderer';
import { useOrdersQuery } from './hooks/useOrdersQuery';
import styles from './Orders.module.css';

/**
 * Orders Management Entry Point using CSS Modules.
 * The QueryClientProvider has been moved to a higher-level (Admin.jsx)
 * to support global features like the Omni-Search bar.
 */
const Orders = () => {
    const { orders, isLoading } = useOrdersQuery();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <AdminDashboardStats />
                <Toolbar />
                <ViewRenderer orders={orders} isLoading={isLoading} />
            </main>
        </div>
    );
};

export default Orders;

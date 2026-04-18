import React, { useState } from 'react';
import TableRow from './TableRow';
import { useOrderMutations } from '../../hooks/useOrderMutations';
import styles from './TableView.module.css';

const TableView = ({ orders = [] }) => {
    const { mutate: updateStatus } = useOrderMutations();
    const [page, setPage] = useState(0);
    const pageSize = 15;
    
    const paginated = orders.slice(page * pageSize, (page + 1) * pageSize);
    const totalPages = Math.ceil(orders.length / pageSize);

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.checkboxHeader}></th>
                            <th>Order ID</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Governorate</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(order => (
                            <TableRow key={order.id} order={order} 
                                onStatusChange={(id, status) => updateStatus({ id, status })} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className={styles.footer}>
                <span>Showing {paginated.length} of {orders.length}</span>
                <div className={styles.pagination}>
                    <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>Prev</button>
                    <span className={styles.pageNum}>{page + 1}</span>
                    <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default TableView;

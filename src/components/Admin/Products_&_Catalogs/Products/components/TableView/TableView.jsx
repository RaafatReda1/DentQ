import React from 'react';
import TableRow from './TableRow';
import Pagination from '../Pagination/Pagination';
import styles from './TableView.module.css';

/**
 * TableView (Plan A) — Full data table with checkboxes, sorting columns, and pagination.
 * 
 * Props:
 *   - products[] — current page of products
 *   - totalCount — total across all pages
 *   - currentPage / pageSize / onPageChange
 *   - selectedIds[] / onSelectId(id) / onSelectAll()
 *   - onEdit(product) / onView(product) / onDuplicate(product) / onDelete(product)
 */
const TableView = ({
    products,
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    selectedIds,
    onSelectId,
    onSelectAll,
    onEdit,
    onView,
    onDuplicate,
    onDelete,
}) => {
    const allSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.headerRow}>
                            <th className={styles.checkHeader}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onSelectAll}
                                    className={styles.checkbox}
                                />
                            </th>
                            <th className={styles.colHeader}>img</th>
                            <th className={styles.colHeader}>Name</th>
                            <th className={styles.colHeader}>Price</th>
                            <th className={styles.colHeader}>Stock</th>
                            <th className={styles.colHeader}>Status</th>
                            <th className={styles.colHeader}>Rating</th>
                            <th className={styles.colHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                product={product}
                                isSelected={selectedIds.includes(product.id)}
                                onSelect={onSelectId}
                                onEdit={onEdit}
                                onView={onView}
                                onDuplicate={onDuplicate}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {products.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No products found</p>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default TableView;

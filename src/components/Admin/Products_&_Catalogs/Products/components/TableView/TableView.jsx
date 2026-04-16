import React from 'react';
import { useTranslation } from 'react-i18next';
import TableRow from './TableRow';
import Pagination from '../Pagination/Pagination';
import styles from './TableView.module.css';

/**
 * TableView — Plan A: Data table with checkboxes and sortable headers.
 * Fully localized.
 */
const TableView = ({
    products = [],
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    selectedIds = [],
    onSelectId,
    onSelectAll,
    onEdit,
    onView,
    onDelete,
}) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.checkCol}>
                                <input
                                    type="checkbox"
                                    checked={products.length > 0 && products.every((p) => selectedIds.includes(p.id))}
                                    onChange={onSelectAll}
                                />
                            </th>
                            <th className={styles.productCol}>{tp('col_name')}</th>
                            <th className={styles.priceCol}>{tp('col_price')}</th>
                            <th className={styles.stockCol}>{tp('col_stock')}</th>
                            <th className={styles.statusCol}>{tp('col_status')}</th>
                            <th className={styles.ratingCol}>{tp('col_rating')}</th>
                            <th className={styles.actionCol}>{tp('col_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <TableRow
                                key={p.id}
                                product={p}
                                isSelected={selectedIds.includes(p.id)}
                                onSelect={onSelectId}
                                onEdit={onEdit}
                                onView={onView}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className={styles.emptyTable}>
                        <p>{tp('no_products')}</p>
                    </div>
                )}
            </div>

            <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default TableView;

import React from 'react';
import DetailList from './DetailList';
import DetailPanel from './DetailPanel';
import styles from './DetailView.module.css';

/**
 * DetailView (Plan C) — Master/Detail layout: scrollable list on left, detail pane on right.
 * 
 * Props:
 *   - products[] — all fetched products
 *   - selectedProduct (object | null)
 *   - onSelectProduct(product)
 *   - stats: { total, active, lowStock }
 *   - onEdit(product) / onDuplicate(product) / onDelete(product)
 *   - onToggle(id, fieldName, currentValue)
 */
const DetailView = ({
    products,
    selectedProduct,
    onSelectProduct,
    stats,
    onEdit,
    onDuplicate,
    onDelete,
    onToggle,
}) => {
    return (
        <div className={styles.detailView}>
            {/* Left: Master list */}
            <div className={styles.listPane}>
                <DetailList
                    products={products}
                    selectedId={selectedProduct?.id}
                    onSelect={onSelectProduct}
                    stats={stats}
                />
            </div>

            {/* Right: Detail panel */}
            <div className={styles.detailPane}>
                <DetailPanel
                    product={selectedProduct}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    onToggle={onToggle}
                />
            </div>
        </div>
    );
};

export default DetailView;

import React from 'react';
import DetailList from './DetailList';
import DetailPanel from './DetailPanel';
import styles from './DetailView.module.css';

/**
 * DetailView — Plan C: Master/Detail 2-column layout.
 * Localized via sub-components.
 */
const DetailView = ({ 
    products, 
    selectedProduct, 
    onSelectProduct, 
    stats,
    onEdit,
    onDelete,
    onToggle
}) => {
    return (
        <div className={styles.detailView}>
            {/* Left list pane (35%) */}
            <div className={styles.listPane}>
                <DetailList 
                    products={products} 
                    selectedId={selectedProduct?.id} 
                    onSelect={onSelectProduct}
                    stats={stats}
                />
            </div>

            {/* Right detail pane (65%) */}
            <div className={styles.detailPane}>
                <DetailPanel 
                    product={selectedProduct} 
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                />
            </div>
        </div>
    );
};

export default DetailView;

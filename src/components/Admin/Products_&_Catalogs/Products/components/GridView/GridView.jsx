import React from 'react';
import { Plus } from 'lucide-react';
import ProductCard from './ProductCard';
import Pagination from '../Pagination/Pagination';
import styles from './GridView.module.css';

/**
 * GridView (Plan B) — Card grid layout with dashed "Add" card at end.
 * 
 * Props:
 *   - products[] — current page of products
 *   - totalCount / currentPage / pageSize / onPageChange
 *   - onEdit(product) / onView(product) / onDelete(product)
 *   - onAddProduct() — opens the add form
 */
const GridView = ({
    products,
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    onEdit,
    onView,
    onDelete,
    onAddProduct,
}) => {
    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={onEdit}
                        onView={onView}
                        onDelete={onDelete}
                    />
                ))}

                {/* Dashed "Add new product" card */}
                <button className={styles.addCard} onClick={onAddProduct}>
                    <Plus size={28} className={styles.addIcon} />
                    <span className={styles.addText}>Add new product</span>
                </button>
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

export default GridView;

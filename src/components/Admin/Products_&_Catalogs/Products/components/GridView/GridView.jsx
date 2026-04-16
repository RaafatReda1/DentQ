import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import Pagination from '../Pagination/Pagination';
import styles from './GridView.module.css';

/**
 * GridView — Plan B: Card grid layout.
 * Localized and supports bilingual names.
 */
const GridView = ({
    products = [],
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
    onAddProduct
}) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);

    return (
        <div className={styles.gridContainer}>
            <div className={styles.grid}>
                {products.map((p) => (
                    <ProductCard
                        key={p.id}
                        product={p}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}

                {/* Dashed "Add" card at the end */}
                <button className={styles.addCard} onClick={onAddProduct}>
                    <Plus size={32} strokeWidth={1.5} />
                    <span>{tp('add_new_product')}</span>
                </button>
            </div>

            {products.length === 0 && (
                <div className={styles.emptyGrid}>
                    <p>{tp('no_products')}</p>
                </div>
            )}

            <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default GridView;

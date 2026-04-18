import React from 'react';
import { useTranslation } from 'react-i18next';
import RenderProductNameOrDesc from '../../../../../utils/RenderProductNameOrDesc';
import styles from './ProductSummaryPopover.module.css';

/**
 * Enriched Popover for product peeking. Supports bilingual localization.
 */
const ProductSummaryPopover = ({ items = [], visible, onClick }) => {
    const { i18n } = useTranslation();
    if (!items.length) return null;

    const displayItems = items.slice(0, 4);
    const moreCount = items.length - 4;

    return (
        <div 
            className={`${styles.popover} ${visible ? styles.show : ''}`}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
            <div className={styles.title}>
                <span>Order Contents</span>
                <span>{items.length} items</span>
            </div>

            <div className={styles.itemsList}>
                {displayItems.map((item, i) => {
                    const product = item.Products || item.product;
                    return (
                        <div key={i} className={styles.itemLine}>
                            <img src={product?.images?.[0] || '/placeholder.png'} className={styles.thumb} alt="" />
                            <span className={styles.itemName}>
                                {product 
                                    ? RenderProductNameOrDesc(product, 'name', i18n.language) 
                                    : 'Loading Product...'}
                            </span>
                            <span className={styles.qty}>x{item.quantity}</span>
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                {moreCount > 0 && <p>+ {moreCount} additional items</p>}
                <p className={styles.hint}>Click to see full breakdown</p>
            </div>
        </div>
    );
};

export default ProductSummaryPopover;

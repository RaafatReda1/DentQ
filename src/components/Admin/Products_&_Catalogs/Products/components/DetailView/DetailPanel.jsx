import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DetailPanel.module.css';

// Sub-components
import DetailHeader from './components/DetailHeader';
import ImageGallery from './components/ImageGallery';
import DetailToggles from './components/DetailToggles';
import DetailStatsGrid from './components/DetailStatsGrid';

/**
 * DetailPanel — Right-side detail pane for Master/Detail view.
 * Refactored into smaller, focused components for better maintainability.
 */
const DetailPanel = ({ 
    product, 
    onEdit, 
    onDelete, 
    onToggle 
}) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const currentLang = i18n.language;

    if (!product) {
        return (
            <div className={styles.emptyPanel}>
                <p>{tp('select_product')}</p>
            </div>
        );
    }

    const name = currentLang === 'ar' ? (product.nameAr || product.nameEn) : (product.nameEn || product.nameAr);
    const category = currentLang === 'ar' ? (product.Categories?.name_ar || product.Categories?.name_en) : (product.Categories?.name_en || product.Categories?.name_ar);
    const description = currentLang === 'ar' ? (product.descriptionAr || product.descriptionEn) : (product.descriptionEn || product.descriptionAr);

    return (
        <div className={styles.panel}>
            {/* Header / Main Info */}
            <DetailHeader 
                category={category}
                name={name}
                price={product.price}
                originalPrice={product.original_price}
                discount={product.discount}
                onEdit={onEdit}
                onDelete={onDelete}
                product={product}
                tp={tp}
            />

            <div className={styles.content}>
                {/* Images */}
                <ImageGallery images={product.images} />

                <div className={styles.grid}>
                    {/* 1. Quick Toggles */}
                    <DetailToggles 
                        product={product} 
                        onToggle={onToggle} 
                        tp={tp} 
                    />

                    {/* 2. Stats Grid */}
                    <DetailStatsGrid 
                        product={product} 
                        tp={tp} 
                    />
                </div>

                {/* Description */}
                <div className={styles.descriptionRow}>
                    <h4 className={styles.cardTitle}>DESCRIPTION</h4>
                    <p className={styles.description}>
                        {description || 'No description provided.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DetailPanel;

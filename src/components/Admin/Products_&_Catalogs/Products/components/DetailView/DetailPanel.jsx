import React from 'react';
import { Edit3, Trash2, Star, Tag, Eye, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DetailPanel.module.css';

/**
 * DetailPanel — Right-side detail pane for Master/Detail view.
 * Supports bilingual naming, i18n, and removed DUP button.
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
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.categoryPath}>{category || '—'}</div>
                    <h2 className={styles.title}>{name}</h2>
                    <div className={styles.priceRow}>
                        <span className={styles.price}>${Number(product.price).toLocaleString()}</span>
                        {product.original_price && (
                            <span className={styles.originalPrice}>${Number(product.original_price).toLocaleString()}</span>
                        )}
                        {product.discount > 0 && (
                            <span className={styles.discountBadge}>-{product.discount}% OFF</span>
                        )}
                    </div>
                </div>
                
                <div className={styles.mainActions}>
                    <button className={styles.editBtn} onClick={() => onEdit(product)}>
                        <Edit3 size={18} />
                        <span>{tp('btn_edit')}</span>
                    </button>
                    <button className={styles.deleteBtn} onClick={() => onDelete(product)}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.imagesRow}>
                    {product.images && product.images.length > 0 ? (
                        product.images.map((url, i) => (
                            <div key={i} className={styles.imageBox}>
                                <img 
                                    src={url} 
                                    alt="" 
                                    className={styles.previewImg} 
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.net/1.png'; }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className={styles.imageBox}>
                            <img 
                                src="https://placehold.net/1.png" 
                                alt="Placeholder" 
                                className={styles.previewImg} 
                            />
                        </div>
                    )}
                </div>

                <div className={styles.grid}>
                    {/* 1. Quick Toggles */}
                    <div className={styles.card}>
                        <h4 className={styles.cardTitle}>{tp('quick_toggles')}</h4>
                        <div className={styles.toggleGroup}>
                            <div className={styles.toggleItem}>
                                <div className={styles.toggleInfo}>
                                    <span className={styles.toggleLabel}>{tp('toggle_active')}</span>
                                </div>
                                <label className={styles.switch}>
                                    <input 
                                        type="checkbox" 
                                        checked={product.is_active}
                                        onChange={() => onToggle(product.id, 'is_active', product.is_active)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.toggleItem}>
                                <div className={styles.toggleInfo}>
                                    <span className={styles.toggleLabel}>{tp('toggle_featured')}</span>
                                </div>
                                <label className={styles.switch}>
                                    <input 
                                        type="checkbox" 
                                        checked={product.is_featured}
                                        onChange={() => onToggle(product.id, 'is_featured', product.is_featured)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.toggleItem}>
                                <div className={styles.toggleInfo}>
                                    <span className={styles.toggleLabel}>{tp('toggle_trending')}</span>
                                </div>
                                <label className={styles.switch}>
                                    <input 
                                        type="checkbox" 
                                        checked={product.is_trending}
                                        onChange={() => onToggle(product.id, 'is_trending', product.is_trending)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 2. Stats Grid */}
                    <div className={styles.card}>
                        <h4 className={styles.cardTitle}>{tp('inventory_stats')}</h4>
                        <div className={styles.statsGrid}>
                            <div className={styles.miniStat}>
                                <Tag size={16} className={styles.statIcon} />
                                <div className={styles.statInfo}>
                                    <span className={styles.statVal}>{product.stock}</span>
                                    <span className={styles.statLabel}>{tp('stock_label')}</span>
                                </div>
                            </div>
                            <div className={styles.miniStat}>
                                <ShoppingBag size={16} className={styles.statIcon} />
                                <div className={styles.statInfo}>
                                    <span className={styles.statVal}>{product.sales_count || 0}</span>
                                    <span className={styles.statLabel}>{tp('sales_count')}</span>
                                </div>
                            </div>
                            <div className={styles.miniStat}>
                                <Eye size={16} className={styles.statIcon} />
                                <div className={styles.statInfo}>
                                    <span className={styles.statVal}>{product.views || 0}</span>
                                    <span className={styles.statLabel}>{tp('views_label')}</span>
                                </div>
                            </div>
                            <div className={styles.miniStat}>
                                <Star size={16} className={styles.statIcon} />
                                <div className={styles.statInfo}>
                                    <span className={styles.statVal}>{product.rating || '0.0'}</span>
                                    <span className={styles.statLabel}>{tp('rating_label')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className={styles.card}>
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

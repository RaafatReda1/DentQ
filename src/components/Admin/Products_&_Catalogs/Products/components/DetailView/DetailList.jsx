import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DetailList.module.css';

/**
 * DetailList — Left-side scrollable list for Master/Detail view.
 * Supports bilingual naming and i18n.
 */
const DetailList = ({ 
    products = [], 
    selectedId, 
    onSelect,
    stats 
}) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const currentLang = i18n.language;

    return (
        <div className={styles.listContainer}>
            {/* Compact state summary at top of list */}
            <div className={styles.compactStats}>
                <div className={styles.statItem}>
                    <span className={styles.statVal}>{stats.total}</span>
                    <span className={styles.statLabel}>{tp('total_label')}</span>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.statItem}>
                    <span className={styles.statVal}>{stats.active}</span>
                    <span className={styles.statLabel}>{tp('active_label')}</span>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.statItem}>
                    <span className={`${styles.statVal} ${stats.lowStock > 0 ? styles.alert : ''}`}>
                        {stats.lowStock}
                    </span>
                    <span className={styles.statLabel}>{tp('low_stock_label')}</span>
                </div>
            </div>

            {/* List items */}
            <div className={styles.list}>
                {products.map((p) => {
                    const name = currentLang === 'ar' ? (p.nameAr || p.nameEn) : (p.nameEn || p.nameAr);
                    const category = currentLang === 'ar' ? (p.Categories?.name_ar || p.Categories?.name_en) : (p.Categories?.name_en || p.Categories?.name_ar);

                    return (
                        <div
                            key={p.id}
                            className={`${styles.item} ${selectedId === p.id ? styles.selected : ''} ${!p.is_active ? styles.dimmed : ''}`}
                            onClick={() => onSelect(p)}
                        >
                            <div className={styles.thumbBox}>
                                {p.images?.[0] ? (
                                    <img 
                                        src={p.images[0]} 
                                        alt="" 
                                        className={styles.thumb} 
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <div className={styles.imagePlaceholder} style={{ display: p.images?.[0] ? 'none' : 'flex' }}></div>
                            </div>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.itemName} title={name}>{name}</span>
                                    {p.is_featured && <Star size={10} className={styles.featuredIcon} fill="currentColor" />}
                                </div>
                                <div className={styles.itemSub}>
                                    <span className={styles.itemCat}>{category || '—'}</span>
                                    <span className={styles.itemPrice}>${Number(p.price).toLocaleString()}</span>
                                </div>
                            </div>
                            {selectedId === p.id && <div className={styles.activeIndicator} />}
                        </div>
                    );
                })}

                {products.length === 0 && (
                    <div className={styles.emptyList}>
                        <p>{tp('no_products')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailList;

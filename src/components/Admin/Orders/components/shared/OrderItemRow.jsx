import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RenderProductNameOrDesc from '../../../../../utils/RenderProductNameOrDesc';
import { Hash, Ruler, Palette, Package, Copy, ExternalLink, Check, TrendingUp, Star, Eye, Layers } from 'lucide-react';
import styles from './OrderItemRow.module.css';

const OrderItemRow = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const { t, i18n } = useTranslation();
    
    // Handle Supabase join variations (sometimes returns array)
    const rawProd = item.Products || item.product;
    const product = Array.isArray(rawProd) ? rawProd[0] : rawProd;

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(product?.id || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const analyticsData = [
        { label: t('admin.products.metrics.performance', 'Performance'), value: `${product?.sales_count || 0} ${t('common.sales', 'sales')}`, icon: <TrendingUp size={14} className={styles.trendUp} />, delay: '0.1s' },
        { label: t('admin.products.metrics.rating', 'Global Rating'), value: `${product?.rating || '0.0'} / 5.0`, icon: <Star size={14} className={styles.rating} />, delay: '0.2s' },
        { label: t('admin.products.metrics.stock', 'Inventory Status'), value: `${product?.stock || 0} ${t('common.in_stock', 'in stock')}`, icon: <Layers size={14} className={styles.stockAlert} />, delay: '0.3s' },
        { label: t('admin.products.metrics.engagement', 'Engagement'), value: `${product?.views || 0} ${t('common.views', 'views')}`, icon: <Eye size={14} />, delay: '0.4s' }
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.item} onClick={() => setExpanded(!expanded)}>
                <img src={product?.images?.[0] || '/placeholder.png'} className={styles.image} alt={product?.nameEn || ''} />
                <div className={styles.info}>
                    <div className={styles.utilityBar}>
                        <span className={styles.idBadge}>#{product?.id?.slice(0, 8) || '...'}</span>
                        <button onClick={handleCopy} className={styles.iconBtn}>{copied ? <Check size={12} className={styles.successIcon} /> : <Copy size={12} />}</button>
                        <button onClick={(e) => {e.stopPropagation(); window.open(`/admin/products?search=${product?.id}`, '_blank');}} className={styles.iconBtn}><ExternalLink size={12} /></button>
                    </div>
                    <p className={styles.itemName}>{product ? RenderProductNameOrDesc(product, 'name', i18n.language) : t('common.unknown_item', 'Unknown Item')}</p>
                    <div className={styles.badgeGrid}>
                        <span className={`${styles.badge} ${styles.qtyBadge}`}><Package size={10} /> {t('common.qty', 'QTY')}: {item.quantity || 0}</span>
                        {item.size && <span className={`${styles.badge} ${styles.sizeBadge}`}><Ruler size={10} /> {item.size}</span>}
                        {item.color && <span className={`${styles.badge} ${styles.colorBadge}`}><Palette size={10} /> {item.color}</span>}
                    </div>
                </div>
                <div className={styles.priceBox}>
                    <p className={styles.priceText}>{(item.price || product?.price || 0).toLocaleString()} EGP</p>
                </div>
            </div>
            
            <div className={`${styles.detailArea} ${expanded ? styles.detailOpen : ''}`}>
                <div className={styles.detailGrid}>
                    {analyticsData.map((data, idx) => (
                        <div key={idx} className={styles.card} style={{animationDelay: data.delay}}>
                            <p className={styles.label}>{data.label}</p>
                            <div className={styles.value}>{data.icon} {data.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderItemRow;

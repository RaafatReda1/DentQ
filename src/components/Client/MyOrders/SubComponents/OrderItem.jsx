import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import RenderProductNameOrDesc from '../../../../utils/RenderProductNameOrDesc';
import { useFormatPrice } from '../../../../utils/Hooks/useFormatPrice';
import styles from './OrderItem.module.css';

const OrderItem = ({ item, product, onNavigateToProduct }) => {
    const { t, i18n } = useTranslation();
    const formatPrice = useFormatPrice();

    if (!product) return null;

    const mainImage = product.images?.[0] || '/placeholder.png';

    const handleNavigate = (e) => {
        e.stopPropagation();
        onNavigateToProduct(product);
    };

    return (
        <div className={styles.orderItem}>
            <img
                src={mainImage}
                alt={RenderProductNameOrDesc(product, "name", i18n.language)}
                className={styles.itemImage}
                onError={(e) => { e.target.src = 'https://placehold.net/product-400x400.png' }}
                onClick={handleNavigate}
                style={{ cursor: 'pointer' }}
            />

            <div className={styles.itemDetails}>
                <div className={styles.itemNameWrapper}>
                    <div
                        className={styles.itemName}
                        onClick={handleNavigate}
                        style={{ cursor: 'pointer' }}
                    >
                        {RenderProductNameOrDesc(product, "name", i18n.language)}
                    </div>
                    <button
                        className={styles.viewProductBtn}
                        onClick={handleNavigate}
                        title={t('orders.view_product') || 'View Product'}
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>

                <div className={styles.itemVariants}>
                    {item.color && (
                        <span className={styles.variantBadge}>
                            <span className={styles.colorDot} style={{ backgroundColor: item.color }}></span>
                            {item.color}
                        </span>
                    )}
                    {item.size && (
                        <span className={styles.variantBadge}>
                            {t('cart.size')}: {item.size}
                        </span>
                    )}
                </div>

                <div className={styles.itemQuantity}>
                    {t('cart.quantity') || 'Qty'}: {item.quantity}
                </div>
            </div>

            <div className={styles.itemPrice}>
                <div className={styles.unitPrice}>
                    {formatPrice(item.price)} × {item.quantity}
                </div>
                <div className={styles.totalPrice}>
                    {formatPrice(item.price * item.quantity)}
                </div>
            </div>
        </div>
    );
};

export default OrderItem;

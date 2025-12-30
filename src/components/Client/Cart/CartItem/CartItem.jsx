import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import RenderProductNameOrDesc from '../../../../utils/RenderProductNameOrDesc';
import styles from './CartItem.module.css';
import CartActions from '../CartActions/CartActions';
import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '../../../../utils/Hooks/useFormatPrice';

const CartItem = ({ item, onUpdate }) => {
    const { t } = useTranslation();
    const product = item.product;
    const formatPrice = useFormatPrice();

    // Safety check in case product was deleted but still in cart
    if (!product) return null;
    if (item.qty === 0) return null;

    const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

    return (
        <div className={styles.itemContainer}>
            <div className={styles.productInfo}>
                <div className={styles.imgWrapper}>
                    {mainImage ? (
                        <img src={mainImage} alt={RenderProductNameOrDesc(product, "name")} className={styles.productImg} />
                    ) : (
                        <div className={styles.placeholderImg}>
                            <span>{t("cart.no_image")}</span>
                        </div>
                    )}
                </div>

                <div className={styles.details}>
                    <Link to={`/${product.nameEn.replace(/\s+/g, '-')}/dp/${product.id}`} className={styles.productName}>
                        {RenderProductNameOrDesc(product, "name")}
                        <ExternalLink size={14} className={styles.linkIcon} />
                    </Link>

                    {(item.color || item.size) && (
                        <div className={styles.variants}>
                            {item.color && (
                                <span className={styles.variantBadge}>
                                    <span className={styles.colorDot} style={{ backgroundColor: item.color }}></span>
                                    {item.color}
                                </span>
                            )}
                            {item.size && (
                                <span className={styles.variantBadge}>
                                    <span className={styles.sizeLabel}>{t("cart.size")}:</span>
                                    {item.size}
                                </span>
                            )}
                        </div>
                    )}

                    <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>{t("cart.unit_price")}:</span>
                        <span className={styles.price}>{formatPrice(product.price)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.actionsWrapper}>
                <CartActions item={item} onUpdate={onUpdate} />

                <div className={styles.subtotal}>
                    <span className={styles.subtotalLabel}>{t("cart.subtotal") || "Subtotal"}</span>
                    <span className={styles.subtotalValue}>{formatPrice(product.price * item.qty)}</span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;


import React from 'react';
import { Link } from 'react-router-dom';
import RenderProductNameOrDesc from '../../../../utils/RenderProductNameOrDesc';
import styles from './CartItem.module.css';
import CartActions from '../CartActions/CartActions';
import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '../../../../utils/Hooks/useFormatPrice';

const CartItem = ({ item, onUpdate }) => {
    const { t } = useTranslation();
    const product = item.product;
    const formatPrice = useFormatPrice(); // Use the custom hook that gives us an arrow function that needs a name and a number parameter
    // Safety check in case product was deleted but still in cart
    if (!product) return null;
    if(item.qty === 0) return null;
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;
    return (
        <div className={styles.itemContainer}>
            <div className={styles.productInfo}>
                <div className={styles.imgWrapper}>
                    {mainImage ? (
                        <img src={mainImage} alt={RenderProductNameOrDesc(product, "name")} className={styles.productImg} />
                    ) : (
                        <div className={styles.placeholderImg}></div>
                    )}
                </div>

                <div className={styles.details}>
                    <Link to={`/${product.nameEn.replace(/\s+/g, '-')}/dp/${product.id}`} className={styles.productName}>
                        {RenderProductNameOrDesc(product, "name")}
                    </Link>

                    <div className={styles.variants}>
                        {item.color && (
                            <span className={styles.variantBadge}>
                                <span className={styles.colorDot} style={{ backgroundColor: item.color }}></span>
                                {item.color}
                            </span>
                        )}
                        {item.size && (
                            <span className={styles.variantBadge}>{item.size}</span>
                        )}
                    </div>

                    <div className={styles.price}>
                        {formatPrice(product.price)}
                    </div>
                </div>
            </div>

            <div className={styles.actionsWrapper}>
                {/* Subtotal for this line item */}
                <div className={styles.subtotal}>
                    <span className={styles.subtotalLabel}>{t("cart.subtotal") || "Subtotal"}:</span>
                    <span className={styles.subtotalValue}>{formatPrice(product.price * item.qty)}</span>
                </div>

                <CartActions item={item} onUpdate={onUpdate} />
            </div>
        </div>
    );
};

export default CartItem;

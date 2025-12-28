import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';
import { useCartData } from './hooks/useCartData';
import CartItem from './CartItem/CartItem';

const CartPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { cartItems, loading, totalPrice, refreshCart } = useCartData();

    const formatPrice = (price) => {
        return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    {t("product_page.back") || "Back"}
                </button>
                <h1 className={styles.title}>{t("cart.title") || "My Cart"}</h1>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loadingState}>{t("product_page.loading") || "Loading..."}</div>
                ) : cartItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <ShoppingBag size={64} className={styles.emptyIcon} />
                        <h2>{t("cart.empty") || "Your cart is empty"}</h2>
                        <button className={styles.continueBtn} onClick={() => navigate('/')}>
                            {t("cart.continue_shopping") || "Continue Shopping"}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.itemsList}>
                            {cartItems.map((item, idx) => (
                                <CartItem
                                    key={`${item.id}-${item.color}-${item.size}-${idx}`}
                                    item={item}
                                    onUpdate={refreshCart}
                                />
                            ))}
                        </div>

                        <div className={styles.summarySection}>
                            <div className={styles.totalRow}>
                                <span>{t("cart.total") || "Total"}:</span>
                                <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
                            </div>

                            <button className={styles.checkoutBtn}>
                                {t("cart.checkout") || "Proceed to Checkout"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;

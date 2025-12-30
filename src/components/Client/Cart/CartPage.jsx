import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingBag, ShoppingCart, Package, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';
import { useCartData } from './hooks/useCartData';
import CartItem from './CartItem/CartItem';
import { useFormatPrice } from '../../../utils/Hooks/useFormatPrice';

const CartPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartItems, loading, totalPrice, refreshCart } = useCartData();
    const formatPrice = useFormatPrice();

    // Calculate total items count
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className={styles.skeletonContainer}>
            {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonItem}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonLine}></div>
                        <div className={styles.skeletonLineShort}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            {/* Header with gradient background */}
            <div className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        <span>{t("product_page.back") || "Back"}</span>
                    </button>

                    <div className={styles.titleWrapper}>
                        <div className={styles.iconWrapper}>
                            <ShoppingCart className={styles.cartIcon} size={32} />
                            {!loading && cartItems.length > 0 && (
                                <span className={styles.itemBadge}>{totalItems}</span>
                            )}
                        </div>
                        <div>
                            <h1 className={styles.title}>{t("cart.title") || "My Cart"}</h1>
                            {!loading && cartItems.length > 0 && (
                                <p className={styles.subtitle}>
                                    {totalItems} {totalItems === 1 ? t("cart.item") : t("cart.items")} {t("cart.in_your_cart")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <LoadingSkeleton />
                ) : cartItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconWrapper}>
                            <ShoppingBag className={styles.emptyIcon} size={80} />
                            <div className={styles.emptyIconDecor}></div>
                        </div>
                        <h2 className={styles.emptyTitle}>{t("cart.empty") || "Your cart is empty"}</h2>
                        <p className={styles.emptySubtitle}>
                            {t("cart.empty_description")}
                        </p>
                        <button className={styles.continueBtn} onClick={() => navigate('/')}>
                            <Package size={20} />
                            {t("cart.continue_shopping") || "Continue Shopping"}
                        </button>
                    </div>
                ) : (
                    <div className={styles.cartLayout}>
                        {/* Items List */}
                        <div className={styles.itemsSection}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t("cart.cart_items")}</h2>
                                <span className={styles.itemCount}>{totalItems} {t("cart.items")}</span>
                            </div>

                            <div className={styles.itemsList}>
                                {cartItems.map((item, idx) => (
                                    <CartItem
                                        key={`${item.id}-${item.color}-${item.size}-${idx}`}
                                        item={item}
                                        onUpdate={refreshCart}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Summary Section - Sticky on desktop */}
                        <div className={styles.summaryWrapper}>
                            <div className={styles.summarySection}>
                                <div className={styles.summaryHeader}>
                                    <Sparkles size={20} className={styles.sparkleIcon} />
                                    <h3 className={styles.summaryTitle}>{t("cart.order_summary")}</h3>
                                </div>

                                <div className={styles.summaryDetails}>
                                    <div className={styles.summaryRow}>
                                        <span className={styles.summaryLabel}>{t("cart.subtotal")} ({totalItems} {t("cart.items")})</span>
                                        <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span className={styles.summaryLabel}>{t("cart.shipping")}</span>
                                        <span className={styles.summaryValueFree}>{t("cart.calculated_at_checkout")}</span>
                                    </div>

                                    <div className={styles.divider}></div>

                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>{t("cart.total") || "Total"}</span>
                                        <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                                    <span>{t("cart.checkout") || "Proceed to Checkout"}</span>
                                    <ArrowLeft size={20} className={styles.checkoutArrow} />
                                </button>

                                <button className={styles.continueShoppingBtn} onClick={() => navigate('/')}>
                                    {t("cart.continue_shopping") || "Continue Shopping"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

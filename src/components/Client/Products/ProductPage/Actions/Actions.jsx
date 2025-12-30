import React, { useMemo } from 'react';
import { Minus, Plus, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCartActions } from '../../../../../utils/Hooks/useCartActions';
import { useCartData } from '../../../Cart/hooks/useCartData';
import styles from './Actions.module.css';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * Actions Component
 * Handles product quantity adjustments and adding to cart.
 */
const Actions = ({ product, selectedSize, selectedColor, qty, setQty }) => {
    const { addToCart } = useCartActions();
    const { cartItems } = useCartData();
    const {t} = useTranslation();
    // Find if this specific product (with current variant) is already in the cart
    const inCartQty = useMemo(() => {
        if (!cartItems || cartItems.length === 0) return 0;

        // Find item that matches ID and variants
        const match = cartItems.find(item =>
            item.id === product.id &&
            item.size === selectedSize &&
            item.color === selectedColor
        );

        return match ? match.qty : 0;
    }, [cartItems, product.id, selectedSize, selectedColor]);

    // Combine product details with current selections for cart actions
    const currentItem = {
        ...product,
        id: product.id,
        size: selectedSize,
        color: selectedColor,
        qty: qty
    };

    const handleIncrement = () => {
        setQty(prev => (prev === "" ? 1 : prev + 1));
    };

    const handleDecrement = () => {
        if (qty > 1) {
            setQty(prev => prev - 1);
        }
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setQty(value);
        } else if (e.target.value === "") {
            setQty(""); // Allow clearing
        }
    };

    const handleAddToCartConfirm = async () => {
        const finalQty = qty === "" ? 1 : qty;

        if (finalQty < 1) {
            toast.error("Please enter a valid quantity");
            return;
        }

        if (!selectedSize && product.sizes?.length > 0) {
            toast.error("Please select a size");
            return;
        }

        if (!selectedColor && product.colors?.length > 0) {
            toast.error("Please select a color");
            return;
        }

        const itemWithFinalQty = { ...currentItem, qty: finalQty };
        const success = await addToCart(itemWithFinalQty);
        if (success) {
            // Success toast is inside useCartActions
            setQty(1); // Reset to 1 after adding
        }
    };

    return (
        <div className={styles.actionsContainer}>
            {inCartQty > 0 && (
                <div className={styles.inCartBadge}>
                    <ShoppingBag size={14} />
                    <span>{inCartQty} {t("product.in_cart")}</span>
                </div>
            )}

            <div className={styles.controlsRow}>
                <div className={styles.quantityWrapper}>
                    <button
                        className={styles.qtyBtn}
                        onClick={handleDecrement}
                        aria-label="Decrease quantity"
                    >
                        <Minus size={18} />
                    </button>

                    <input
                        type="number"
                        className={styles.qtyInput}
                        value={qty}
                        onChange={handleInputChange}
                        min="1"
                    />

                    <button
                        className={styles.qtyBtn}
                        onClick={handleIncrement}
                        aria-label="Increase quantity"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <button className={styles.confirmBtn} onClick={handleAddToCartConfirm}>
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default Actions;

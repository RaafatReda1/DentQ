import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import styles from './CartActions.module.css';
import { useCartActions } from '../../../../utils/useCartActions';

const CartActions = ({ item, onUpdate }) => {
    const { addToCart, decreaseCartQty, deleteProductFromCart } = useCartActions();
    const [loading, setLoading] = useState(false);

    const handleIncrease = async () => {
        setLoading(true);
        // Pass only the necessary payload for the variant 
        // (addToCart internals will handle filtering, but we pass full item to match signature)
        await addToCart(item); // item has { id, color, size, qty... }
        setLoading(false);
        if (onUpdate) onUpdate();
    };

    const handleDecrease = async () => {
        setLoading(true);
        await decreaseCartQty(item);
        setLoading(false);
        if (onUpdate) onUpdate();
    };

    const handleDelete = async () => {
        if (!window.confirm("Remove this item?")) return;
        setLoading(true);
        await deleteProductFromCart(item);
        setLoading(false);
        if (onUpdate) onUpdate();
    };

    return (
        <div className={styles.actionsContainer}>
            <div className={styles.qtyControls}>
                <button
                    className={styles.qtyBtn}
                    onClick={handleDecrease}
                    disabled={loading || item.qty <= 1}
                >
                    <Minus size={14} />
                </button>

                <span className={styles.qtyValue}>{item.qty}</span>

                <button
                    className={styles.qtyBtn}
                    onClick={handleIncrease}
                    disabled={loading}
                >
                    <Plus size={14} />
                </button>
            </div>

            <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={loading}
                aria-label="Remove item"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default CartActions;

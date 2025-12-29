import React, { useState } from "react";
import { Plus, Minus, X } from "lucide-react";
import styles from "./CartActions.module.css";
import { useCartActions } from "../../../../utils/Hooks/useCartActions";
import { confirmAlert } from "react-confirm-alert";
import { useTranslation } from "react-i18next";

const CartActions = ({ item, onUpdate }) => {
  const { addToCart, decreaseCartQty, deleteProductFromCart } =
    useCartActions();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleIncrease = async () => {
    setLoading(true);
    // Pass only the necessary payload for the variant
    // (addToCart internals will handle filtering, but we pass full item to match signature)
    await addToCart(item, true); // item has { id, color, size, qty... }
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
    setLoading(true);
    confirmAlert({
      //this's a preformed component in "react-confirm-alert"
      title: t("product.delete_title"),
      message: t("product.delete_msg"),
      buttons: [
        {
          label: t("product.yes"),
          onClick: async () => {
            await deleteProductFromCart(item);
            setLoading(false);
            if (onUpdate) onUpdate();
          },
        },
        {
          label: t("product.no"),
          onClick: () => console.log("Delete cart item is Cancelled"),
        },
      ],
    });
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

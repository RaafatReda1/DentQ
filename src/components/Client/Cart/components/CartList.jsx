import React from 'react';
import styles from '../CartPage.module.css';
import CartItem from '../CartItem/CartItem';

const CartList = ({ cartItems, totalItems, t, refreshCart }) => {
  return (
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
  );
};

export default CartList;

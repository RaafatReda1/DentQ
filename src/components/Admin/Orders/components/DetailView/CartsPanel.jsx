import React from 'react';
import { useCartsQuery } from '../../hooks/useCartsQuery';
import { ShoppingCart, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import styles from './CartsPanel.module.css';
import { useTranslation } from "react-i18next";

const CartItem = ({ cart }) => (
    <div className={styles.card}>
        <div className={styles.cardHeader}>
            <div className={styles.userBox}>
                <div className={styles.avatar}><User size={16} /></div>
                <div>
                    <p className={styles.userName}>{cart.Clients?.fullName || 'Guest User'}</p>
                    <p className={styles.cartId}>ID: {cart.id.slice(0, 8)}...</p>
                </div>
            </div>
            <span className={styles.itemCount}>{cart.items?.length || 0} items</span>
        </div>
        <div className={styles.footer}>
            <Clock size={12} /> 
            <span>Last active: {format(new Date(cart.updated_at), 'MMM d, HH:mm')}</span>
        </div>
    </div>
);

const CartsPanel = () => {
  const { t } = useTranslation();
    const { data: carts, isLoading } = useCartsQuery();

    if (isLoading) return <div className={styles.container}>{t("admin.orders.carts.loading", "Loading carts...")}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.iconBox}><ShoppingCart size={20} /></div>
                <h2>{t("admin.orders.carts.live_abandoned", "Live Abandoned Carts")}</h2>
            </div>
            <div className={styles.grid}>
                {carts.map(cart => <CartItem key={cart.id} cart={cart} />)}
                {carts.length === 0 && <p>{t("admin.orders.carts.no_active", "No active carts found.")}</p>}
            </div>
        </div>
    );
};

export default CartsPanel;

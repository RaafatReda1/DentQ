import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCartsQuery } from '../../hooks/useCartsQuery';
import { useOrdersStore } from '../../store/useOrdersStore';
import CartsToolbar from './CartsToolbar';
import CartCard from './CartCard';
import { ShoppingBag } from 'lucide-react';
import styles from './CartsView.module.css';

const CartsView = () => {
    const { t } = useTranslation();
    const { carts, isLoading } = useCartsQuery();
    const { filters } = useOrdersStore();

    if (isLoading) return <div className={styles.loader}>{t('common.loading', 'Loading Carts...')}</div>;

    const renderContent = () => {
        if (!carts.length) {
            return (
                <div className={styles.emptyState}>
                    <ShoppingBag size={48} />
                    <p>{t('admin.carts.no_results', 'No carts found matching your filters.')}</p>
                </div>
            );
        }

        return (
            <div className={filters.cartView === 'table' ? styles.listView : styles.gridView}>
                {carts.map(cart => <CartCard key={cart.id} cart={cart} />)}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <CartsToolbar />
            {renderContent()}
        </div>
    );
};

export default CartsView;

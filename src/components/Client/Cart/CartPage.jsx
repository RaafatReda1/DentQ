import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../../utils/AppContexts';
import styles from './CartPage.module.css';
import { useCartData } from './hooks/useCartData';
import { useFormatPrice } from '../../../utils/Hooks/useFormatPrice';
import GuestWarningBanner from '../../Shared/GuestWarningBanner/GuestWarningBanner';

// Sub-components
import CartHeader from './components/CartHeader';
import EmptyCart from './components/EmptyCart';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import CartSkeleton from './components/CartSkeleton';

const CartPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user] = useContext(userContext);
    const { cartItems, loading, totalPrice, refreshCart } = useCartData();
    const formatPrice = useFormatPrice();

    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className={styles.pageContainer}>
            <CartHeader 
                t={t} 
                navigate={navigate} 
                loading={loading} 
                cartItems={cartItems} 
                totalItems={totalItems} 
            />

            <div className={styles.content}>
                {user?.type === 'guest' && !loading && <GuestWarningBanner />}

                {loading ? (
                    <CartSkeleton />
                ) : cartItems.length === 0 ? (
                    <EmptyCart t={t} navigate={navigate} />
                ) : (
                    <div className={styles.cartLayout}>
                        <CartList 
                            cartItems={cartItems} 
                            totalItems={totalItems} 
                            t={t} 
                            refreshCart={refreshCart} 
                        />
                        <CartSummary 
                            t={t} 
                            totalItems={totalItems} 
                            totalPrice={totalPrice} 
                            formatPrice={formatPrice} 
                            navigate={navigate} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

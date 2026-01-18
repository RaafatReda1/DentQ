import React from 'react';
import OrderHeader from './OrderHeader';
import OrderBody from './OrderBody';
import OrderFooter from './OrderFooter';
import styles from './OrderCard.module.css';

const OrderCard = ({ order, isExpanded, onToggle, onNavigateToProduct }) => {
    return (
        <div className={styles.orderCard}>
            <OrderHeader
                orderId={order.id}
                createdAt={order.created_at}
                status={order.status}
                isExpanded={isExpanded}
                onClick={onToggle}
            />

            <OrderBody
                items={order.Order_items}
                isExpanded={isExpanded}
                onNavigateToProduct={onNavigateToProduct}
            />

            {isExpanded && (
                <OrderFooter
                    paymentMethod={order.payment_method}
                    totalAmount={order.total_amount}
                />
            )}
        </div>
    );
};

export default OrderCard;

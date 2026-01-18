// Helper functions for MyOrders component

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Get the CSS class name for order status styling
 * @param {string} status - Order status
 * @param {object} styles - CSS module styles object
 * @returns {string} CSS class name
 */
export const getStatusStyle = (status, styles) => {
    switch (status?.toLowerCase()) {
        case 'pending': return styles.statusPending;
        case 'completed':
        case 'delivered': return styles.statusCompleted;
        case 'cancelled': return styles.statusCancelled;
        default: return styles.statusPending;
    }
};

/**
 * Navigate to product page
 * @param {function} navigate - React Router navigate function
 * @param {object} product - Product object
 */
export const navigateToProductPage = (navigate, product) => {
    navigate(`/${product.nameEn.replace(/\\s+/g, '-')}/dp/${product.id}`);
};

/**
 * Toggle order expansion state
 * @param {string} orderId - Order ID to toggle
 * @param {Set} expandedOrders - Set of currently expanded order IDs
 * @param {function} setExpandedOrders - State setter function
 */
export const toggleOrderExpansion = (orderId, expandedOrders, setExpandedOrders) => {
    setExpandedOrders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(orderId)) {
            newSet.delete(orderId);
        } else {
            newSet.add(orderId);
        }
        return newSet;
    });
};

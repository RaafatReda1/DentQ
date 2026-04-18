/**
 * Configuration for Filter Options in the Orders Dashboard.
 * These are used by FiltersBar and Search components.
 */

export const statusOptions = [
    { label: 'Pending', value: 'pending', color: '#f59e0b' },
    { label: 'Processing', value: 'processing', color: '#3b82f6' },
    { label: 'Shipped', value: 'shipped', color: '#8b5cf6' },
    { label: 'Delivered', value: 'delivered', color: '#10b981' },
    { label: 'Cancelled', value: 'cancelled', color: '#ef4444' },
    { label: 'Returned', value: 'returned', color: '#64748b' }
];

export const paymentOptions = [
    { label: 'Cash on Delivery', value: 'Cash' },
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'InstaPay', value: 'InstaPay' }
];

export const governorates = [
    { id: 1, nameEn: 'Cairo', nameAr: 'القاهرة' },
    { id: 2, nameEn: 'Giza', nameAr: 'الجيزة' },
    { id: 3, nameEn: 'Alexandria', nameAr: 'الإسكندرية' },
    { id: 4, nameEn: 'Sharqia', nameAr: 'الشرقية' },
    { id: 5, nameEn: 'Dakahlia', nameAr: 'الدقهلية' }
];

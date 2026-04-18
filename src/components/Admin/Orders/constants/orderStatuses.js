/**
 * Order status configuration: Labels, colors (Tailwind), and transitions.
 */

export const ORDER_STATUSES = [
    { id: 'pending',   label: 'Pending',   color: 'amber',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
    { id: 'shipped',   label: 'Shipped',   color: 'purple',  bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200' },
    { id: 'delivered', label: 'Delivered', color: 'green',   bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200' },
    { id: 'paid',      label: 'Paid',      color: 'blue',    bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
    { id: 'cancelled', label: 'Cancelled', color: 'red',     bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
];

export const STATUS_NEXT = {
    pending: 'shipped',
    shipped: 'delivered',
    delivered: 'paid',
    paid: null,
    cancelled: null
};

export const getStatusConfig = (id) => ORDER_STATUSES.find(s => s.id === id) || ORDER_STATUSES[0];

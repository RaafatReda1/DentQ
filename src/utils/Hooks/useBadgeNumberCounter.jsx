import { useMemo } from "react";
import { useCart } from "../../components/Storage/CartProvider";

/**
 * useBadgeNumberCounter Hook
 * Synchronously calculates the total quantity of items in the cart.
 * Responds immediately to changes in the cart state from the CartProvider.
 */
export const useBadgeNumberCounter = () => {
  const { cart } = useCart();

  const cartCount = useMemo(() => {
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return 0;
    }
    // Calculate total quantity by summing the qty of each item
    return cart.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }, [cart]);

  return { cartCount };
};

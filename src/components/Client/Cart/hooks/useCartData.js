import { useCart } from "../../../Storage/CartProvider";

/**
 * useCartData Hook
 * Now a simple wrapper around the global useCart() to ensure 
 * consistent state across the entire application.
 */
export const useCartData = () => {
  const {
    cart,
    cartItems,
    loading,
    totalPrice,
    refreshCart
  } = useCart();

  return { cartItems, loading, totalPrice, refreshCart, cart };
};

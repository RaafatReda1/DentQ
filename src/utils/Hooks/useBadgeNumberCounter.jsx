import { useEffect, useState } from "react";
import { useCart } from "../../components/Storage/CartProvider";

export const useBadgeNumberCounter = () => {
  const [cartCount, setCartCount] = useState(0);
  const { cart } = useCart();

  const cartBadgeCount = async () => {
    if (!cart?.items) {
      setCartCount(0);
      return;
    }
    const totalQty = cart.items.reduce((sum, item) => sum + item.qty, 0);

    setCartCount(totalQty);
  };

  useEffect(() => {
    cartBadgeCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  return { cartCount };
};

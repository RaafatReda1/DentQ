import React, { useEffect, useState } from "react";
import { useCartActions } from "../../../../utils/Hooks/useCartActions";
import useRealtimeSubscription from "../../../../utils/useRealtimeSubscription";

function Cart() {
  const [cart, setCart] = useState([]);
  const { fetchCart } = useCartActions();
  useEffect(() => {
    const fetchCartData = async () => {
      const cartData = await fetchCart();
      setCart(cartData);
    };
    fetchCartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);
  // Real-time subscription to Carts table
  useRealtimeSubscription(
    `cart-${cart.id}`, //channel name which can be anything
    "Carts", //table we're listening to
    `id=eq.${cart.id}`, //filter for which product we need to listen
    (payload) => {
      console.log("Real-time update received:", payload.new);
      setCart((prev) => ({ ...prev, ...payload.new }));
    },
    "*"
  );
  return <div>Cart</div>;
}

export default Cart;

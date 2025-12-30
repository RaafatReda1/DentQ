/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import useCartDataStorage from "../Storage/useCartDataStorage";

export const cartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const cartData = useCartDataStorage();

  return (
    <cartContext.Provider value={cartData}>
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(cartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};

// بص يسطا انا عملت الملف ده بشكل منفصل كده عشان ال CartContext مبيشتغلش بالطريقه العاديه انك تخزنه ك context وتستورده من provider لانه بيعتمد في شغله علي ال UserContext واللي مبيكونش لسه حمل لما بنيجي نستخدمه ف ال App.jsx 

import React, { useContext } from "react";
import { userContext } from "../../utils/AppContexts";
import Header from "./ClientHeader/Header/Header";
import ProdcutsParent from "./Products/ClientProductsPreview/ProdcutsParent/ProdcutsParent";
import ProfilePage from "./Profile/ProfilePage";
import { Route, Routes } from "react-router-dom";
import CartPage from "./Cart/CartPage";
import ProductPage from "./Products/ProductPage/ProductPage";
import CheckOut from "./CheckOut/CheckOutPage";
const Client = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(userContext);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProdcutsParent />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:productNameEn/dp/:productId" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckOut />} />
      </Routes>
    </>
  );
};

export default Client;

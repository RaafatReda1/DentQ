import React, { useContext } from "react";
import { userContext } from "../../utils/AppContexts";
import Header from "./ClientHeader/Header/Header";
import ProdcutsParent from "./Products/ClientProductsPreview/ProdcutsParent/ProdcutsParent";
import ProductPage from "./Products/ProductPage/ProductPage";
import CartPage from "./Cart/CartPage";
import { Route, Routes } from "react-router-dom";
const Client = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(userContext);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProdcutsParent />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/:productNameEn/dp/:productId" element={<ProductPage />} />
      </Routes>
    </>
  );
};

export default Client;

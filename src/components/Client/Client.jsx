import React, { useContext } from "react";
import { userContext } from "../../utils/AppContexts";
import Header from "./ClientHeader/Header/Header";
import ProdcutsParent from "./Products/ClientProductsPreview/ProdcutsParent/ProdcutsParent";
import ProductPage from "./Products/ProductPage/ProductPage";
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
const Client = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(userContext);
  return (
    <>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<ProdcutsParent />} />
        <Route path="/:productNameEn/dp/:productId" element={<ProductPage />} />
      </Routes>
    </>
  );
};

export default Client;

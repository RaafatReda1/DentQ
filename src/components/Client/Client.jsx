import React, { useContext } from "react";
import { userContext } from "../../utils/AppContexts";
import Header from "./ClientHeader/Header/Header";
import ProdcutsParent from "./Products/ClientProductsPreview/ProdcutsParent/ProdcutsParent";
import ProfilePage from "./Profile/ProfilePage";
import { Route, Routes } from "react-router-dom";
import CartPage from "./Cart/CartPage";
import ProductPage from "./Products/ProductPage/ProductPage";
import CheckOut from "./CheckOut/CheckOutPage";
import MyOrders from "./MyOrders/MyOrders";
import MainViewer from "./Products/ClientProductsPreview/Main/MainViewer/MainViewer";
import CategoryPage from "./Products/CategoryPage/CategoryPage";
import PrivacyPage from "../Shared/PrivacyPage/PrivacyPage";
import TermsOfUsePage from "../Shared/TermsOfUsePage/TermsOfUsePage";
import Footer from "./Products/ClientProductsPreview/Footer/Footer";

const Client = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(userContext);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainViewer />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:productNameEn/dp/:productId" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms-and-conditions" element={<TermsOfUsePage/>} />
      </Routes>
      <Footer />
    </>
  );
};

export default Client;

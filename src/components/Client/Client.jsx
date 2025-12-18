import React, { useContext } from "react";
import { userContext } from "../../utils/AppContexts";
import Header from "./ClientHeader/Header/Header";
import ProdcutsParent from "./Products/ClientProductsPreview/ProdcutsParent/ProdcutsParent";

const Client = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(userContext);
  return (
    <>
      <Header />
      <ProdcutsParent />
    </>
  );
};

export default Client;

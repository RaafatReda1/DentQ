import React, { useContext } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { productsContext } from "../../../../../utils/AppContexts";
import styles from "./ProdcutsParent.module.css";

const ProdcutsParent = () => {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useContext(productsContext);

  return (
    <div className={styles.productsParent}>
      {products.productsList? (products.productsList.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))): null}
    </div>
  );
};

export default ProdcutsParent;

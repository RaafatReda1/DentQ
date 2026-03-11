import React, { useContext, useRef } from "react";
import styles from "./Slider.module.css";
import { productsContext } from "../../../../../../utils/AppContexts";
import ProductCard from "../../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";

const Slider = ({ CatId }) => {
  const [products] = useContext(productsContext);
  const { i18n } = useTranslation();
  const sliderRef = useRef(null);

  const filteredProducts =
    products?.productsList?.filter((product) => product.category_id === CatId) || [];

  const category = products?.CategoriesList?.find((c) => c.id === CatId);

  const scroll = (direction) => {
    const isLTR = i18n.language === "en";
    const amount = direction === "left" ? (isLTR ? -300 : 300) : (isLTR ? 300 : -300);
    sliderRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!filteredProducts.length) return null;

  return (
    <div className={styles.sliderWrapper} id= {"category/" + CatId}>
      {category && (
        <h2 className={styles.sliderTitle}>
          {i18n.language === "en" ? category.name_en : category.name_ar}
        </h2>
      )}
      
      <div className={styles.sliderContainer}>
        <button
          className={styles.arrowButton}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          &#10094;
        </button>
        
        <div className={styles.productsContainer} ref={sliderRef}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <button
          className={styles.arrowButton}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Slider;

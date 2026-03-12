import React, { useContext, useRef, useMemo } from "react";
import styles from "./Slider.module.css";
import { productsContext } from "../../../../../../utils/AppContexts";
import ProductCard from "../../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";

const Slider = ({ CatId }) => {
  const [products] = useContext(productsContext);
  const { i18n } = useTranslation();
  const sliderRef = useRef(null);

  const category = products?.CategoriesList?.find((c) => c.id === CatId);

  // Recursively fetch all nested category branch items (children, grandchildren, etc.)
  const getCategoryDescendants = (categoryId, allCategories) => {
    let descendants = [categoryId];
    const children = allCategories.filter((c) => c.parent_id === categoryId);
    
    for (let child of children) {
      descendants = [
        ...descendants,
        ...getCategoryDescendants(child.id, allCategories),
      ];
    }
    return descendants;
  };

  const filteredProducts = useMemo(() => {
    if (!products?.CategoriesList || !products?.productsList) return [];

    const validCategoryIds = getCategoryDescendants(CatId, products.CategoriesList);

    return products.productsList.filter((product) => 
      validCategoryIds.includes(product.category_id)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CatId, products]);

  const scroll = (direction) => {
    const isLTR = i18n.language === "en";
    const amount = direction === "left" ? (isLTR ? -300 : 300) : (isLTR ? 300 : -300);
    sliderRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!filteredProducts.length) return null;

  return (
    <div className={styles.sliderWrapper} id={"category/" + CatId}>
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

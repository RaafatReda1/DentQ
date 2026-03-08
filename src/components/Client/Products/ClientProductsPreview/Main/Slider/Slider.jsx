import React, { useContext, useRef } from "react";
import styles from "./Slider.module.css";
import { productsContext } from "../../../../../../utils/AppContexts";
import ProductCard from "../../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";

const Slider = ({ CatId = "c046e2cd-e96b-44e3-93e2-8dadbe2d74b9" }) => {
  const [products] = useContext(productsContext);
  const { i18n } = useTranslation();

  const filteredProducts =
    products?.productsList?.filter(
      (product) => product.category_id === CatId,
    ) || [];
  const sliderRef = useRef(null);

  const category = products?.CategoriesList?.find((c) => c.id === CatId);

  return (
    <div className={styles.slider} id="home">
      <h2 className={styles.sliderTitle}>
        {category &&
          (i18n.language === "en" ? category.name_en : category.name_ar)}
      </h2>
      <div className= {styles.sliderContainer}>
        <button
        className={styles.Arrow}
        onClick={() =>
          sliderRef.current?.scrollBy({
            left: i18n.language === "en" ? -300 : 300,
            behavior: "smooth",
          })
        }
      >
        {"<"}
      </button>
      <div className={styles.productsContainer} ref={sliderRef}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button
        className={styles.Arrow}
        onClick={() =>
          sliderRef.current?.scrollBy({
            left: i18n.language === "en" ? 300 : -300,
            behavior: "smooth",
          })
        }
      >
        {">"}
      </button>
      </div>
    </div>
  );
};

export default Slider;

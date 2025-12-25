import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ProductsSlider.module.css";
import { productsContext } from "../../../../../../utils/AppContexts";
import ProductCard from "../../ClientProductsPreview/ProductCard/ProductCard";

const ProductsSlider = ({ category }) => {
  const { t } = useTranslation();
  const [products] = useContext(productsContext);

  // Filter related products (same category, limit 10)
  // Note: We might want to exclude the current product, but 'category' is just the ID here.
  // Ideally passed current product ID to exclude it.
  const relatedProducts = products.productsList
    .filter((p) => p.category_id === category)
    .slice(0, 10);

  if (relatedProducts.length === 0) return null;

  return (
    <div className={styles.sliderContainer}>
      <h3 className={styles.title}>{t("product_page.related_products")}</h3>
      <div className={styles.sliderGrid}>
        {relatedProducts.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} scrollToTop={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSlider;
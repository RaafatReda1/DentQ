import React from "react";
import styles from "../CategoryPage.module.css";
import ProductCard from "../../ClientProductsPreview/ProductCard/ProductCard";

/**
 * Handles iterating over given products and displaying them nicely in the CSS Grid.
 * Contains empty-state fallback.
 */
const CategoryProductGrid = ({ categoryProducts, isLTR }) => {
  if (!categoryProducts || categoryProducts.length === 0) {
    return (
      <div className={styles.emptyState}>
        {isLTR
          ? "No products found in this category."
          : "لم يتم العثور على منتجات في هذه الفئة."}
      </div>
    );
  }

  return (
    <div className={styles.productsGrid}>
      {categoryProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CategoryProductGrid;

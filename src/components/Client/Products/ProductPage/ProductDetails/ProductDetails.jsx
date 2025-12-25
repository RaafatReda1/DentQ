import React from 'react';
import { useTranslation } from "react-i18next";
import RenderProductNameOrDesc from '../../../../../utils/RenderProductNameOrDesc';
import MDEditor from "@uiw/react-md-editor";
import styles from "./ProductDetails.module.css";
import { ShoppingCart } from "lucide-react";

function ProductDetails({ product }) {
  const { t } = useTranslation();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Or dynamic currency
    }).format(price);
  };

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.tags}>
        {product.is_active && <span className={`${styles.tag} ${styles.active}`}>{t("product.available")}</span>}
        {product.is_trending && <span className={`${styles.tag} ${styles.trending}`}>{t("product.trending")}</span>}
        {/* Category tag could go here if we fetch category name */}
      </div>

      {/* Price Section */}
      <div className={styles.priceSection}>
        <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
        {product.original_price && product.original_price > product.price && (
          <>
            <span className={styles.originalPrice}>{formatPrice(product.original_price)}</span>
            <span className={styles.discount}>
              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% {t("product.discount")}
            </span>
          </>
        )}
      </div>

      {/* Add To Cart */}
      <div className={styles.addToCartSection}>
        <button className={styles.addToCartBtn}>
          <ShoppingCart size={20} />
          {t("product.add_to_cart")}
        </button>
      </div>

      {/* Description */}
      <div className={styles.description}>
        <MDEditor.Markdown
          source={RenderProductNameOrDesc(product, "fullDesc") || t("product_page.no_description")}
          style={{
            background: "transparent",
            color: "inherit",
            fontSize: "1rem",
            lineHeight: "1.6",
          }}
        />
      </div>
    </div>
  );
}

export default ProductDetails;
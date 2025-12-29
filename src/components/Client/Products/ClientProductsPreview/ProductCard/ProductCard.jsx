/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styles from "./ProductCard.module.css";
import {
  ShoppingCart,
  Eye,
  Star,
  Tag,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRenderProductPage } from "../../../../../utils/RenderProductPage";
import RenderProductNameOrDesc from "../../../../../utils/RenderProductNameOrDesc";
import { useCartActions } from "../../../../../utils/Hooks/useCartActions";
import { useFormatPrice } from "../../../../../utils/Hooks/useFormatPrice";

const ProductCard = ({ product, scrollToTop }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { t } = useTranslation();
  const renderProductPage = useRenderProductPage();
  const { addToCart } = useCartActions();
  const formattedPrice = useFormatPrice(product.price);
  const formattedOriginalPrice = useFormatPrice(product.original_price);
  // Destructure product data structure based on the schema
  const {
    price,
    original_price,
    images = [],
    rating,
    discount,
    is_featured,
    is_trending,
  } = product || {};

  // Parse images if it's a string (Postgres array sometimes comes as string if not parsed by lib),
  // but usually supabase client returns JS array. Safety check.
  const productImages = Array.isArray(images) ? images : [];
  const mainImage = productImages.length > 0 ? productImages[0] : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded) return;

    setIsAdded(true);
    // Reset after animation duration (e.g., 2 seconds)
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Format price


  return (
    <div className={styles.card}>
      {/* Top Banner (Category/Status) */}
      <div className={`${styles.subCard} ${styles.topBar}`}>
        <span className={styles.categoryTag}>
          {is_trending
            ? t("product.trending")
            : is_featured
            ? t("product.featured")
            : t("product.new_arrival")}
        </span>
        {discount > 0 && (
          <span className={styles.discountBadge}>
            {t("product.discount")} {discount}%
          </span>
        )}
      </div>

      {/* Main Card Content */}
      <div className={styles.cardContainer}>
        {/* Product Image */}
        <div className={styles.imageWrapper}>
          {mainImage ? (
            <img
              src={mainImage}
              alt={RenderProductNameOrDesc(product, "name")}
              className={styles.productImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholderImage}>
              <ImageIcon size={48} className={styles.placeholderIcon} />
            </div>
          )}
        </div>

        {/* Overlay Actions (Revealed on Hover) */}
        <div className={styles.overlay}>
          <button
            className={`${styles.actionButton} ${isAdded ? styles.added : ""}`}
            aria-label={t("product.add_to_cart")}
            onClick={async (e) => {
              const success = await addToCart(product);
              if (success) {
                handleAddToCart(e);
              }
            }}
          >
            {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
          {/* Open product page scrollToTop*/}
          <button
            className={styles.actionButton}
            aria-label={t("product.view_details")}
            onClick={() => {
              if (scrollToTop) {
                renderProductPage(product.nameEn, product.id);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              } else {
                renderProductPage(product.nameEn, product.id);
              }
              scrollToTop = false;
            }}
          >
            <Eye size={20} />
          </button>
        </div>

        {/* Product Details (Always visible but styled) */}
        <div className={styles.productInfo}>
          <h3 className={styles.productTitle}>
            {RenderProductNameOrDesc(product, "name")}
          </h3>

          <div className={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(rating || 0)
                    ? styles.starFilled
                    : styles.starEmpty
                }
                fill={i < Math.round(rating || 0) ? "currentColor" : "none"}
              />
            ))}
            <span className={styles.ratingValue}>({rating || 0})</span>
          </div>

          <p className={styles.productDescription}>
            {RenderProductNameOrDesc(product, "desc")?.substring(0, 60)}
            {RenderProductNameOrDesc(product, "desc")?.length > 60 ? "..." : ""}
          </p>

          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>{formattedPrice}</span>
            {original_price > price && (
              <span className={styles.originalPrice}>
                {formattedOriginalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Label (Name repeated or extra info - tailored to the design request which had a bottom subCard) */}
      <div
        className={`${styles.subCard} ${styles.bottomBar} ${
          isAdded ? styles.added : ""
        }`}
        onClick={async (e) => {
          const success = await addToCart(product);
          if (success) {
            handleAddToCart(e);
          }
        }}
      >
        <span className={styles.addToCartText}>
          {isAdded ? t("product.added_to_cart") : t("product.add_to_cart")}
        </span>
        {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
      </div>
    </div>
  );
};

export default ProductCard;

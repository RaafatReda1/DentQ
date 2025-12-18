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

const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { t, i18n } = useTranslation();

  // Destructure product data structure based on the schema
  const {
    name,
    description,
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
//   حته كده يصحبي بن detect اللغه بيها عن طريق ال I18n وبنعمل ال Currency علي اساسها
const formatPrice = (amount) => {
    const num = Number(amount);
    if (i18n.language === "ar") {
      return new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "EGP",
      }).format(isNaN(num) ? 0 : num);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(isNaN(num) ? 0 : num);
    }
  };
  return (
    <div className={styles.card}>
      {/* Top Banner (Category/Status) */}
      <div className={`${styles.subCard} ${styles.topBar}`}>
        <span className={styles.categoryTag}>
          {is_trending ? "Trending" : is_featured ? "Featured" : "New Arrival"}
        </span>
        {discount > 0 && (
          <span className={styles.discountBadge}>-{discount}%</span>
        )}
      </div>

      {/* Main Card Content */}
      <div className={styles.cardContainer}>
        {/* Product Image */}
        <div className={styles.imageWrapper}>
          {mainImage ? (
            <img
              src={mainImage}
              alt={name}
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
            aria-label="Add to Cart"
            onClick={handleAddToCart}
          >
            {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
          <button className={styles.actionButton} aria-label="View Details">
            <Eye size={20} />
          </button>
        </div>

        {/* Product Details (Always visible but styled) */}
        <div className={styles.productInfo}>
          <h3 className={styles.productTitle}>{name}</h3>

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
            {description?.substring(0, 60)}
            {description?.length > 60 ? "..." : ""}
          </p>

          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>{formatPrice(price)}</span>
            {original_price > price && (
              <span className={styles.originalPrice}>
                {formatPrice(original_price)}
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
        onClick={handleAddToCart}
      >
        <span className={styles.addToCartText}>
          {isAdded ? "Added to Cart" : "Add to Cart"}
        </span>
        {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
      </div>
    </div>
  );
}

export default ProductCard;

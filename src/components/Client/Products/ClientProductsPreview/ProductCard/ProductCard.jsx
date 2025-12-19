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

const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { t, i18n } = useTranslation();
  const renderProductPage = useRenderProductPage();
  // Destructure product data structure based on the schema
  const {
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
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
  const formatPrice = (amount) => {
    const num = Number(amount);
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP", // Assuming EGP based on your previous code
    }).format(isNaN(num) ? 0 : num);
  };

  const currentName = i18n.language === "ar" ? (nameAr || nameEn) : (nameEn || nameAr);
  const currentDescription = i18n.language === "ar" ? (descriptionAr || descriptionEn) : (descriptionEn || descriptionAr);

  return (
    <div className={styles.card}>
      {/* Top Banner (Category/Status) */}
      <div className={`${styles.subCard} ${styles.topBar}`}>
        <span className={styles.categoryTag}>
          {is_trending ? t('product.trending') : is_featured ? t('product.featured') : t('product.new_arrival')}
        </span>
        {discount > 0 && <span className={styles.discountBadge}>{t('product.discount')} -{discount}%</span>}
      </div>

      {/* Main Card Content */}
      <div className={styles.cardContainer}>
        {/* Product Image */}
        <div className={styles.imageWrapper}>
          {mainImage ? (
            <img
              src={mainImage}
              alt={currentName}
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
            className={`${styles.actionButton} ${isAdded ? styles.added : ''}`}
            aria-label={t('product.add_to_cart')}
            onClick={handleAddToCart}
          >
            {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
          <button className={styles.actionButton} aria-label={t('product.view_details')} onClick={() => renderProductPage(product.nameEn, product.id)}>
            <Eye size={20} />
          </button>
        </div>

        {/* Product Details (Always visible but styled) */}
        <div className={styles.productInfo}>
          <h3 className={styles.productTitle}>{currentName}</h3>

          <div className={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.round(rating || 0) ? styles.starFilled : styles.starEmpty}
                fill={i < Math.round(rating || 0) ? "currentColor" : "none"}
              />
            ))}
            <span className={styles.ratingValue}>({rating || 0})</span>
          </div>

          <p className={styles.productDescription}>
            {currentDescription?.substring(0, 60)}
            {currentDescription?.length > 60 ? '...' : ''}
          </p>

          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>{formatPrice(price)}</span>
            {original_price > price && (
              <span className={styles.originalPrice}>{formatPrice(original_price)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Label (Name repeated or extra info - tailored to the design request which had a bottom subCard) */}
      <div
        className={`${styles.subCard} ${styles.bottomBar} ${isAdded ? styles.added : ''}`}
        onClick={handleAddToCart}
      >
        <span className={styles.addToCartText}>
          {isAdded ? t('product.added_to_cart') : t('product.add_to_cart')}
        </span>
        {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState } from "react";
import styles from "./ProductCard.module.css";
import { ShoppingCart, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRenderProductPage } from "../../../../../utils/Hooks/useRenderProductPage";
import { useCartActions } from "../../../../../utils/Hooks/useCartActions";
import { useFormatPrice } from "../../../../../utils/Hooks/useFormatPrice";

// Sub-components
import CardBadges from "./components/CardBadges";
import CardImage from "./components/CardImage";
import CardOverlay from "./components/CardOverlay";
import CardInfo from "./components/CardInfo";

const ProductCard = ({ product, scrollToTop }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { t, i18n } = useTranslation();
  const renderProductPage = useRenderProductPage();
  const { addToCart } = useCartActions();
  const formatPrice = useFormatPrice();

  const {
    price,
    original_price,
    images = [],
    rating,
    discount,
    is_featured,
    is_trending,
  } = product || {};

  const productImages = Array.isArray(images) ? images : [];
  const mainImage = productImages.length > 0 ? productImages[0] : null;

  const handleAddToCart = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isAdded) return;

    const success = await addToCart(product);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleViewDetails = () => {
    renderProductPage(product.nameEn, product.id);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.card}>
      <CardBadges 
        t={t} 
        is_trending={is_trending} 
        is_featured={is_featured} 
        discount={discount} 
      />

      <div className={styles.cardContainer}>
        <CardImage product={product} mainImage={mainImage} i18n={i18n} />

        <CardOverlay 
          t={t} 
          isAdded={isAdded} 
          onAddToCart={handleAddToCart} 
          onViewDetails={handleViewDetails} 
        />

        <CardInfo 
          product={product} 
          i18n={i18n} 
          rating={rating} 
          price={price} 
          original_price={original_price} 
          formatPrice={formatPrice} 
        />
      </div>

      <div
        className={`${styles.subCard} ${styles.bottomBar} ${isAdded ? styles.added : ""}`}
        onClick={handleAddToCart}
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

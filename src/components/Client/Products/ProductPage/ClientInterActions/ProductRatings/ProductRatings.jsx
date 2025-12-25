import React, { useState, useContext, useEffect } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./ProductRatings.module.css";
import { userContext } from "../../../../../../utils/AppContexts";
import { supabase } from "../../../../../../utils/SupabaseClient";

const ProductRatings = ({ product }) => {
  const { t } = useTranslation();
  const [user] = useContext(userContext);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [showAdviceModal, setShowAdviceModal] = useState(false);

  // Fetch user's existing rating for this product
  useEffect(() => {
    const fetchUserRating = async () => {
      if (user.type === "client" && user.id) {
        const { data, error } = await supabase
          .from("ProductRatings")
          .select("rating")
          .eq("product_id", product.id)
          .eq("client_id", user.id)
          .maybeSingle();

        if (data) {
          setUserRating(data.rating);
        }
      }
    };
    fetchUserRating();
  }, [user.id, user.type, product.id]);

  const handleRate = async (ratingValue) => {
    if (user.type !== "client" && user.type !== "admin") {
      alert(t("reviews.signin_alert"));
      return;
    }

    // Determine if insert or update (upsert)
    // Constraint: unique_client_product_rating unique (product_id, client_id)
    const { error } = await supabase
      .from("ProductRatings")
      .upsert(
        {
          product_id: product.id,
          client_id: user.id,
          rating: ratingValue,
        },
        { onConflict: "product_id, client_id" }
      );

    if (error) {
      console.error("Error rating product:", error);
      alert(t("reviews.save_rating_failed"));
    } else {
      setUserRating(ratingValue);
      setShowAdviceModal(true); // Encouragement popup
    }
  };

  return (
    <div className={styles.ratingsContainer}>
      <h3 className={styles.title}>{t("reviews.title")}</h3>

      {/* Average Display */}
      <div className={styles.starsContainer}>
        <span className={styles.ratingValue}>{product.rating?.toFixed(1) || t("reviews.new")}</span>
        <span className={styles.reviewCount}>({product.review_count || 0} {t("reviews.reviews_count")})</span>
      </div>

      {/* Interactive Stars */}
      <div className={styles.inputSection}>
        <p>{t("reviews.rate_title")}</p>
        <div className={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`${styles.star} ${(hoverRating || userRating) >= star ? styles.filled : ""}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRate(star)}
            >
              <Star size={24} fill="currentColor" />
            </button>
          ))}
        </div>
        {userRating && <p className={styles.userRatingMsg}>{t("reviews.you_rated")} {userRating}/5</p>}
      </div>

      {/* Advice Modal */}
      {showAdviceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>{t("reviews.success_modal.title")}</h3>
            <p>{t("reviews.success_modal.desc")}</p>
            <div className={styles.modalButtons}>
              <button className={`${styles.modalBtn} ${styles.modalBtnPrimary}`} onClick={() => {
                // Ideally scroll to comment section or open it
                document.querySelector('#comment-section')?.scrollIntoView({ behavior: 'smooth' });
                setShowAdviceModal(false);
              }}>{t("reviews.success_modal.write_review")}</button>
              <button className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} onClick={() => setShowAdviceModal(false)}>{t("reviews.success_modal.later")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRatings;
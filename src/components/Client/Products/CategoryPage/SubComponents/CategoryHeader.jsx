import React from "react";
import styles from "../CategoryPage.module.css";

/**
 * Displays the Title of the current Category, as well as the Sort options dropdown.
 */
const CategoryHeader = ({ currentCategory, isLTR, sortOption, setSortOption }) => {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>
        {isLTR ? currentCategory.name_en : currentCategory.name_ar}
      </h1>

      <div className={styles.sortContainer}>
        <select
          className={styles.sortSelect}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">{isLTR ? "Default" : "رئيسي"}</option>
          <option value="newest">{isLTR ? "Newest" : "الأحدث"}</option>
          <option value="rating">{isLTR ? "Rating" : "التقييم"}</option>
          <option value="priceHighLow">
            {isLTR ? "Price: High to Low" : "السعر من الأعلى إلى الأدنى"}
          </option>
          <option value="priceLowHigh">
            {isLTR ? "Price: Low to High" : "السعر من الأدنى إلى الأعلى"}
          </option>
        </select>
      </div>
    </div>
  );
};

export default CategoryHeader;

import React, { useContext, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { productsContext } from "../../../../utils/AppContexts";
import styles from "./CategoryPage.module.css";
import { useTranslation } from "react-i18next";
import CategoryBreadcrumbs from "./SubComponents/CategoryBreadcrumbs";
import CategoryHeader from "./SubComponents/CategoryHeader";
import CategoryProductGrid from "./SubComponents/CategoryProductGrid";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products] = useContext(productsContext);
  const { i18n } = useTranslation();
  const isLTR = i18n.language === "en";

  const [sortOption, setSortOption] = useState("default");

  // Derive the current category details from slug
  const currentCategory = useMemo(() => {
    return products?.CategoriesList?.find((c) => c.slug === slug);
  }, [products?.CategoriesList, slug]);

  // Recursively fetch all nested category branch items (children, grandchildren, etc.)
  const getCategoryDescendants = (categoryId, allCategories) => {
    let descendants = [categoryId];
    const children = allCategories.filter((c) => c.parent_id === categoryId);
    
    for (let child of children) {
      descendants = [
        ...descendants,
        ...getCategoryDescendants(child.id, allCategories),
      ];
    }
    return descendants;
  };

  // Filter and actively sort the products
  const categoryProducts = useMemo(() => {
    if (!currentCategory || !products?.productsList) return [];

    const validCategoryIds = getCategoryDescendants(
      currentCategory.id,
      products.CategoriesList
    );

    let filtered = products.productsList.filter((p) =>
      validCategoryIds.includes(p.category_id)
    );

    // Apply Sorting Options
    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "priceLowHigh":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceHighLow":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        // By default respect any pre-existing sort_order mapping if available
        break;
    }

    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, products, sortOption]);

  // Loading and Error check fallbacks
  if (!products?.CategoriesList?.length) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!currentCategory) {
    return <div className={styles.notFound}>Category not found</div>;
  }

  // Orchestrate layout utilizing the extracted sub-components
  return (
    <div className={styles.pageContainer} dir={isLTR ? "ltr" : "rtl"}>
      
      <CategoryBreadcrumbs 
        currentCategory={currentCategory} 
        CategoriesList={products.CategoriesList} 
        isLTR={isLTR} 
      />

      <CategoryHeader 
        currentCategory={currentCategory} 
        isLTR={isLTR} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />

      <CategoryProductGrid 
        categoryProducts={categoryProducts} 
        isLTR={isLTR} 
      />
      
    </div>
  );
};

export default CategoryPage;

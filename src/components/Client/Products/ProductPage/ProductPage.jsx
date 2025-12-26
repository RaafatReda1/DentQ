import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { productsContext } from "../../../../utils/AppContexts";
import styles from "./ProductPage.module.css";
import ProductDetails from "./ProductDetails/ProductDetails";
import ImgsViewer from "./ImgsViewer/ImgsViewer";
import SizesViewer from "./SizesViewer/SizesViewer";
import ColorsViewer from "./ColorsViewer/ColorsViewer";
import ProductsSlider from "./ProductsSlider/ProductsSlider";
import ProductRatings from "./ClientInterActions/ProductRatings/ProductRatings";
import ProductCommentSection from "./ClientInterActions/ProductCommentSection/ProductCommentSection";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../../../../utils/SupabaseClient";

const ProductPage = () => {
  const { t, i18n } = useTranslation();
  const { productId } = useParams();
  const [products] = useContext(productsContext);
  const navigate = useNavigate();

  const initialProduct = products.productsList.find(
    (product) => product.id === productId
  );

  const [liveProduct, setLiveProduct] = useState(initialProduct);

  // Update liveProduct if the initial product from context changes (e.g. initial load)
  useEffect(() => {
    if (initialProduct) {
      setLiveProduct(initialProduct);
    }
  }, [initialProduct]);

  // Real-time subscription
  useEffect(() => {
    if (!productId) return;

    const channel = supabase
      .channel(`product-${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Products',
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload.new);
          setLiveProduct(prev => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  if (!liveProduct) return <div>{t("product_page.loading")}</div>;

  const displayName = i18n.language === "ar" ? liveProduct.nameAr : liveProduct.nameEn;

  return (
    <div className={styles.productPageContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft /> {t("product_page.back")}
      </button>

      <h1 className={styles.productName}>{displayName}</h1>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <ProductDetails product={liveProduct} />
          <SizesViewer product={liveProduct} />
          <ProductRatings product={liveProduct} />
          <ProductCommentSection product={liveProduct} />
        </div>

        <div className={styles.rightColumn}>
          <ImgsViewer product={liveProduct} />
          <ColorsViewer product={liveProduct} />
        </div>
      </div>

      <div className={styles.sliderSection}>
        <ProductsSlider category={liveProduct.category_id} />
      </div>
    </div>
  );
};

export default ProductPage;

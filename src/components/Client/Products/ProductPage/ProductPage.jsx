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
import useRealtimeSubscription from "../../../../utils/useRealtimeSubscription";
import RenderProductNameOrDesc from "../../../../utils/RenderProductNameOrDesc";

const ProductPage = () => {
  const { t } = useTranslation();
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

  // Real-time subscription to Products table
  useRealtimeSubscription(
    `product-${productId}`,//channel name which can be anything
    'Products',//table we're listening to
    `id=eq.${productId}`,//filter for which product we need to listen
    (payload) => {
      console.log('Real-time update received:', payload.new);
      setLiveProduct(prev => ({ ...prev, ...payload.new }));
    },
    'UPDATE'
  );

  if (!liveProduct) return <div>{t("product_page.loading")}</div>;



  return (
    <div className={styles.productPageContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft /> {t("product_page.back")}
      </button>

      <h1 className={styles.productName}>{RenderProductNameOrDesc(liveProduct, "name")}</h1>

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

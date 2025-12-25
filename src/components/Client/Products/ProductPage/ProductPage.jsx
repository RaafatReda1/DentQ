import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const ProductPage = () => {
  const { productId } = useParams();
  const [products] = useContext(productsContext);
  const navigate = useNavigate();

  const product = products.productsList.find(
    (product) => product.id === productId
  );

  if (!product) return <div>Loading...</div>; // Or some fallback

  return (
    <div className={styles.productPageContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
      </button>

      <h1 className={styles.productName}>{product.nameEn}</h1>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <ProductDetails product={product} />
          <SizesViewer product={product} />
          <ProductRatings product={product} />
          <ProductCommentSection product={product} />
        </div>

        <div className={styles.rightColumn}>
          <ImgsViewer product={product} />
          <ColorsViewer product={product} />
        </div>
      </div>

      <div className={styles.sliderSection}>
        <ProductsSlider category={product.category_id} />
      </div>
    </div>
  );
};

export default ProductPage;

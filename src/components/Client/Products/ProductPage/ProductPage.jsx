import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { productsContext } from "../../../../utils/AppContexts";
import styles from "./ProductPage.module.css";
import ProductDetails from "./ProductDetails/ProductDetails";
import ImgsViewer from "./ImgsViewer/ImgsViewer";
import SizesViewer from "./SizesViewer/SizesViewer";
import ColorsViewer from "./ColorsViewer/ColorsViewer";
import ProductsSlider from "./ProductsSlider/ProductsSlider";

const ProductPage = () => {
  // what we need now is to render the product page accroding to the product id from the url
  const { productId } = useParams(); //احنا سجلنا ال productId كباراميتر ف ال ProductPage url واتحفظ ف الRouter ك اوبجت بناديه تاني هنا (<Route path="/:productNameEn/dp/:productId" element={<ProductPage />} />)
  const [products] = useContext(productsContext);

  const product = products.productsList.find(
    (product) => product.id === productId
  ); //the product that we'll render
  return (
    <>
      <div className={styles.productName}>{product.nameEn}</div>
      <ProductDetails product={product} />
      <ImgsViewer product={product} />
      <SizesViewer product={product} />
      <ColorsViewer product={product} />
      <ProductsSlider category={product.category_id} />
    </>
  );
};

export default ProductPage;

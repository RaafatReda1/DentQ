import React from 'react'
import { useParams } from 'react-router-dom';

const ProductPage = () => {
    // what we need now is to render the product page accroding to the product id from the url
    const { productId } = useParams(); //احنا سجلنا ال productId كباراميتر ف ال ProductPage url واتحفظ ف الRouter ك اوبجت بناديه تاني هنا (<Route path="/:productNameEn/dp/:productId" element={<ProductPage />} />)

  return (
    <div></div>
  )
}

export default ProductPage
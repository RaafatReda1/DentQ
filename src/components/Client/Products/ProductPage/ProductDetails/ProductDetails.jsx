import React from 'react'
import RenderProductNameOrDesc from '../../../../../utils/RenderProductNameOrDesc'
import MDEditor from "@uiw/react-md-editor";
import styles from "./ProductPage.module.css";
function ProductDetails({product}) {
  return (
    <>
      <div className="product-description">
        <h2 className= {styles.productName}>{RenderProductNameOrDesc(product, "name")}</h2>
      {/* Full description of the product */}
            <MDEditor.Markdown
              source={
                RenderProductNameOrDesc(product, "fullDesc") || "*No description available*"
              }
              style={{
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                lineHeight: "1.6",
              }}
            />
          </div>
    </>
  )
}

export default ProductDetails
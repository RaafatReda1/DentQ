import React from "react";
import styles from "./OrderDetails.module.css";
const OrderDetails = () => {
  return (
    <section className={styles.orderDetailsSection}>
      <table className={styles.productsTable}>
        <thead>
          <th>Qty</th>
          <th>Product</th>
          <th>Description</th>
          <th>Price</th>
          <th>Total</th>
        </thead>

        <tbody>
          <tr>
            <td>3</td>
            <td>Iphone 15 Pro Max</td>
            <td>
              This is an extremely valuable iphone that can call anyone
              everywhere...
            </td>
            <td>120</td>
            <td>360</td>
          </tr>
          {/* copy should be deleted later */}

          <tr>
            <td>3</td>
            <td>Iphone 15 Pro Max</td>
            <td>
              This is an extremely valuable iphone that can call anyone
              everywhere...
            </td>
            <td>120</td>
            <td>360</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Iphone 15 Pro Max</td>
            <td>
              This is an extremely valuable iphone that can call anyone
              everywhere...
            </td>
            <td>120</td>
            <td>360</td>
          </tr>


        </tbody>
      </table>
    </section>
  );
};

export default OrderDetails;

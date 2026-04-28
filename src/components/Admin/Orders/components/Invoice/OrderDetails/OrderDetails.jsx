import React from "react";
import styles from "./OrderDetails.module.css";
import { useTranslation } from "react-i18next";

const OrderDetails = ({ order }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const items = order?.Order_items || [];

  return (
    <section className={styles.orderDetailsSection}>
      <table className={styles.productsTable}>
        <thead>
          <tr>
            <th>{t("admin.orders.invoice.qty", "Qty")}</th>
            <th>{t("admin.orders.invoice.product", "Product")}</th>
            <th>{t("admin.orders.invoice.description", "Description")}</th>
            <th>{t("admin.orders.invoice.price", "Price")}</th>
            <th>{t("admin.orders.invoice.total", "Total")}</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const p = item.Products;
            const prodName = isAr ? (p?.nameAr || p?.nameEn) : (p?.nameEn || p?.nameAr || "Product");
            
            let desc = [];
            if (item.color) desc.push(`${t("admin.orders.invoice.color", "Color")}: ${item.color}`);
            if (item.size) desc.push(`${t("admin.orders.invoice.size", "Size")}: ${item.size}`);
            
            const totalPrice = (item.quantity * Number(item.price)).toLocaleString();

            return (
              <tr key={item.id}>
                <td>{item.quantity}</td>
                <td>{prodName}</td>
                <td>{desc.join(" - ") || "---"}</td>
                <td>{Number(item.price).toLocaleString()} EGP</td>
                <td>{totalPrice} EGP</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default OrderDetails;

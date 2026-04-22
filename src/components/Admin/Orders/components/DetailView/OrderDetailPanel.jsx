import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Printer, XCircle, ShoppingBag } from "lucide-react";
import StatusStepper from "../shared/StatusStepper";
import OrderItemsPopup from "../shared/OrderItemsPopup";
import { useOrderDetailQuery } from "../../hooks/useOrderDetailQuery";
import { useOrderMutations } from "../../hooks/useOrderMutations";
import styles from "./OrderDetailPanel.module.css";
import Invoice from "../Invoice/Invoice";
import { useReactToPrint } from "react-to-print";

const OrderDetailPanel = ({ orderId }) => {
  const { t } = useTranslation();
  const { data: order, isLoading } = useOrderDetailQuery(orderId);
  const { mutate: updateStatus } = useOrderMutations();
  const [showItems, setShowItems] = useState(false);

  const ref = useRef();
  const handlePrint = useReactToPrint({
    contentRef: ref,
  });

  console.log(ref.current);
  if (isLoading)
    return (
      <div className={styles.container}>
        {t("common.loading", "Loading details...")}
      </div>
    );
  if (!order)
    return (
      <div className={styles.container}>
        {t("admin.orders.detail.select_hint", "Select an order")}
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h2>{order.full_name}</h2>
          <p className={styles.orderId}>
            {t("admin.orders.detail.id", "Order ID")}: {order.id}
          </p>
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => setShowItems(true)}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <ShoppingBag size={16} />{" "}
            {t("admin.orders.detail.view_products", "View Products")}
          </button>

          <button
            onClick={() => {
              if (!ref.current) return;
              handlePrint();
            }}
            className={`${styles.btn} ${styles.printBtn}`}
          >
            <Printer size={16} /> {t("admin.orders.detail.print", "Print")}
          </button>

          {order.status !== "cancelled" && (
            <button
              onClick={() =>
                updateStatus({ id: order.id, status: "cancelled" })
              }
              className={`${styles.btn} ${styles.cancelBtn}`}
            >
              <XCircle size={16} /> {t("admin.orders.detail.cancel", "Cancel")}
            </button>
          )}
        </div>
      </div>
      <StatusStepper
        currentStatus={order.status}
        onStatusClick={(s) => updateStatus({ id: order.id, status: s })}
      />
      <div className={styles.infoGrid}>
        <div>
          <h4 className={styles.sectionTitle}>
            {t("admin.orders.detail.customer_title", "Customer info")}
          </h4>
          <p className={styles.infoText}>
            {t("profile.phone", "Phone")}:{" "}
            <span className={styles.infoValue}>{order.phone_number}</span>
          </p>
          <p className={styles.infoText}>
            {t("profile.address", "Address")}:{" "}
            <span className={styles.infoValue}>{order.address}</span>
          </p>
        </div>
        <div>
          <h4 className={styles.sectionTitle}>{t("cart.total", "Totals")}</h4>
          <p className={styles.totalPrice}>
            {Number(order.total_amount).toLocaleString()} EGP
          </p>
        </div>
      </div>
      <OrderItemsPopup
        isOpen={showItems}
        onClose={() => setShowItems(false)}
        items={order.Order_items}
      />
      <Invoice ref={ref} order={order} />
    </div>
  );
};

export default OrderDetailPanel;

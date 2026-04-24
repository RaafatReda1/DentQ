import React from "react";
import styles  from "./Invoice.module.css";
import InvoiceHeader from "./InvoiceHeader/InvoiceHeader";
import RecepientData from "./RecepientData/RecepientData";
import OrderDetails from "./OrderDetails/OrderDetails";
const Invoice = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className={styles.Invoice}>
      <InvoiceHeader />
      <RecepientData />
      <OrderDetails/>
    </div>
  );
});

export default Invoice;

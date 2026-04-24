import React from "react";
import styles  from "./Invoice.module.css";
import InvoiceHeader from "./InvoiceHeader/InvoiceHeader";
const Invoice = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className={styles.Invoice}>
      <InvoiceHeader />
    </div>
  );
});

export default Invoice;

import React from "react";
import styles  from "./Invoice.module.css";
import InvoiceHeader from "./InvoiceHeader/InvoiceHeader";
import RecepientData from "./RecepientData/RecepientData";
import OrderDetails from "./OrderDetails/OrderDetails";
import Totals from "./Totals/Totals";
import Footer from "./InvoiceFooter/InvoiceFooter";
const Invoice = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className={styles.Invoice}>
      <InvoiceHeader />
      <RecepientData />
      <OrderDetails/>
      <Totals />
      <Footer/>
    </div>
  );
});

export default Invoice;

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
      <table className={styles.printTable}>
        {/* Magic Repeating Header */}
        <thead>
          <tr>
            <td>
              <InvoiceHeader />
            </td>
          </tr>
        </thead>
        
        {/* Flowing Content */}
        <tbody>
          <tr>
            <td>
              <div className={styles.pageContent}>
                <RecepientData />
                <OrderDetails />
                <Totals />
              </div>
            </td>
          </tr>
        </tbody>

        {/* Magic Repeating Footer */}
        <tfoot>
          <tr>
            <td>
              <Footer />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});

export default Invoice;

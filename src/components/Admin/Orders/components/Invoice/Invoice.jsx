import React, { useState } from "react";
import styles  from "./Invoice.module.css";
import InvoiceHeader from "./InvoiceHeader/InvoiceHeader";
import RecepientData from "./RecepientData/RecepientData";
import OrderDetails from "./OrderDetails/OrderDetails";
import Totals from "./Totals/Totals";
import Footer from "./InvoiceFooter/InvoiceFooter";
import StoreSettingsEditor from "./StoreSettingsEditor";
import { Settings } from "lucide-react";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import { useTranslation } from "react-i18next";

const Invoice = React.forwardRef(({ order }, ref) => {
  const { data: storeSettings } = useStoreSettings();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const invoiceStyle = {
    "--invoice-main-color": storeSettings?.accent_color || "#292929",
  };

  return (
    <div className={styles.invoiceOuterWrapper}>
      {/* Settings control panel outside printable area */}
      <div className={styles.invoiceControls}>
        <button className={styles.btnSettings} onClick={() => setIsEditorOpen(true)}>
          <Settings size={16} /> Edit Branding
        </button>
      </div>

      <div ref={ref} className={styles.Invoice} style={invoiceStyle}>
        <table className={styles.printTable}>
        {/* Magic Repeating Header */}
        <thead>
          <tr>
            <td>
              <InvoiceHeader order={order} />
            </td>
          </tr>
        </thead>
        
        {/* Flowing Content */}
        <tbody>
          <tr>
            <td>
              <div className={styles.pageContent}>
                <RecepientData order={order} />
                <OrderDetails order={order} />
                <Totals order={order} />
              </div>
            </td>
          </tr>
        </tbody>

        {/* Magic Repeating Spacer to ensure table doesn't overlap fixed footer */}
        <tfoot>
          <tr>
            <td>
              <div className={styles.footerSpacer}></div>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* The Actual Footer natively sticking to the bottom on print pages */}
      <div className={styles.fixedFooter}>
        <Footer />
      </div>
    </div>
    
    <StoreSettingsEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
    </div>
  );
});

export default Invoice;

import React from "react";
import { Edit2, Trash2, MapPin } from "lucide-react";
import styles from "../ShippingEditor.module.css";

const ShippingTable = ({ rates, onEdit, onDelete, t }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("admin.marketing.shipping.governorate", "Governorate")}</th>
            <th>{t("admin.marketing.shipping.price", "Shipping Price")}</th>
            <th>{t("admin.marketing.shipping.actions", "Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rates.length === 0 ? (
            <tr>
              <td colSpan="3" className={styles.emptyCell}>
                {t("admin.marketing.shipping.no_rates", "No shipping rates found.")}
              </td>
            </tr>
          ) : (
            rates.map((rate) => (
              <tr key={rate.id}>
                <td>
                  <div className={styles.govCell}>
                    <div className={styles.govIcon}><MapPin size={14} /></div>
                    <div>
                      <div className={styles.govEn}>{rate.governorateEn}</div>
                      <div className={styles.govAr}>{rate.governorateAr}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.priceCell}>
                  <span className={styles.priceTag}>{rate.shippingPrice.toLocaleString()} EGP</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => onEdit(rate)} title={t("common.edit", "Edit")}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => onDelete(rate.id)} title={t("common.delete", "Delete")}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShippingTable;

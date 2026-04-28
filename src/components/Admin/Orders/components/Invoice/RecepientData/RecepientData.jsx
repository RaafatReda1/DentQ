import React from "react";
import styles from "../RecepientData/RecepientData.module.css";
import {
  AtSign,
  Building2,
  LocateIcon,
  LocationEdit,
  LocationEditIcon,
  PhoneForwarded,
  User,
} from "lucide-react";
const RecepientData = ({ order }) => {
  return (
    <section className= {styles.recepientSection}>
      <h2>Recepient Data</h2>
      <section className={styles.recepientDataContainer}>
        <div className={styles.personalData}>
          <div className={`${styles.recepientDataField} ${styles.Name}`}>
            <User></User>
            <span>{order?.full_name || "Unknown"}</span>
          </div>

          <div className={`${styles.recepientDataField} ${styles.Phone}`}>
            <PhoneForwarded></PhoneForwarded>
            <span dir="ltr">{order?.phone_number || "---"}</span>
          </div>

          <div className={`${styles.recepientDataField} ${styles.Email}`}>
            <AtSign></AtSign>
            <span>{order?.Clients?.email || "---"}</span>
          </div>
        </div>

        <div className={styles.delivaryData}>
          <div className={`${styles.recepientDataField} ${styles.Location}`}>
            <LocationEdit></LocationEdit>
            <span>{order?.address || "---"}</span>
          </div>

          <div className={`${styles.recepientDataField} ${styles.Gov}`}>
            <Building2></Building2>
            <span>{order?.GovernoratesShipping?.governorateAr || order?.GovernoratesShipping?.governorateEn || "---"}</span>
          </div>
        </div>
      </section>
    </section>
  );
};

export default RecepientData;

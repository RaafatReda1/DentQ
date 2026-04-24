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
const RecepientData = () => {
  return (
    <section className= {styles.recepientSection}>
      <h2>Recepient Data</h2>
      <section className={styles.recepientDataContainer}>
        <div className={styles.personalData}>
          <div className={`${styles.recepientDataField} ${styles.Name}`}>
            <User></User>
            <span>رأفت رضا جاهين أحمد</span>
          </div>

          <div className={`${styles.recepientDataField} ${styles.Phone}`}>
            <PhoneForwarded></PhoneForwarded>
            <span>+201022779263</span>
          </div>

          <div className={`${styles.recepientDataField} ${styles.Email}`}>
            <AtSign></AtSign>
            <span>rafat2782005@gmail.com</span>
          </div>
        </div>

        <div className={styles.delivaryData}>
          <div className={`${styles.recepientDataField} ${styles.Location}`}>
            <LocationEdit></LocationEdit>
            <span>البحيرة-حوش عيسي-شارع الجمهورية</span>
          </div>

          <div className={`${styles.recepientDataField} ${styles.Gov}`}>
            <Building2></Building2>
            <span>البحيره</span>
          </div>
        </div>
      </section>
    </section>
  );
};

export default RecepientData;

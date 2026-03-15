import React, { useEffect, useState, useContext } from 'react';
import styles from './ContactUs.module.css';
import { useTranslation } from 'react-i18next';
import { userContext } from '../../../utils/AppContexts';
import { fetchContactData } from './Actions';
import ContactForm from './Subcomponents/ContactForm/ContactForm';
import ContactInfo from './Subcomponents/ContactInfo/ContactInfo';

const ContactUs = () => {
  const { t, i18n } = useTranslation();
  const isLTR = i18n.language.startsWith('en');
  const [user] = useContext(userContext);

  const [contactData, setContactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchContactData();
      if (data) {
        setContactData(data);
      }
      setIsLoading(false);
    };

    getData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2>Loading contact information...</h2>
      </div>
    );
  }

  return (
    <div className={styles.contactUsContainer} dir={isLTR ? "ltr" : "rtl"}>
      <div className={styles.header}>
        <h1>{t("contact_us.title")}</h1>
        <p>{t("contact_us.subtitle")}</p>
      </div>

      <div className={styles.gridContainer}>
        <ContactForm user={user} />
        <ContactInfo contactData={contactData} />
      </div>
    </div>
  );
};

export default ContactUs;
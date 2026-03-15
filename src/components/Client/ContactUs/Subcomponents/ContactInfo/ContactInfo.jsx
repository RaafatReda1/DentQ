import React from 'react';
import styles from '../../ContactUs.module.css';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Building } from 'lucide-react';

const ContactInfo = ({ contactData }) => {
    const { t } = useTranslation();

    // The db returns an array of rows since we removed .maybeSingle() in Actions.js.
    // Each row has `phones` (numeric) and `emails` (text).
    const phones = Array.isArray(contactData)
        ? contactData.map(row => row.phones).filter(Boolean)
        : [];

    const emails = Array.isArray(contactData)
        ? contactData.map(row => row.emails).filter(Boolean)
        : [];

    return (
        <div className={styles.infoContainer}>
            <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                    <Phone size={28} />
                </div>
                <h3>{t("contact_us.phones")}</h3>
                {phones.length > 0 ? (
                    phones.map((phone, idx) => (
                        <p key={idx} dir="ltr">{String(phone).trim()}</p>
                    ))
                ) : (
                    <p>{t("contact_us.support_info")} N/A</p>
                )}
            </div>

            <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                    <Mail size={28} />
                </div>
                <h3>{t("contact_us.emails")}</h3>
                {emails.length > 0 ? (
                    emails.map((email, idx) => (
                        <p key={idx}>{email.trim()}</p>
                    ))
                ) : (
                    <p>{t("contact_us.support_info")} N/A</p>
                )}
            </div>

            
        </div>
    );
};

export default ContactInfo;

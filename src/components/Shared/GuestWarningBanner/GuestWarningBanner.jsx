import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import GoogleBtn from '../../Auth/GoogleBtn/GoogleBtn';
import styles from './GuestWarningBanner.module.css';

const GuestWarningBanner = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <AlertTriangle className={styles.icon} size={24} />
                </div>
                <div className={styles.textContent}>
                    <h3 className={styles.title}>{t('guest_warning.title')}</h3>
                    <p className={styles.description}>{t('guest_warning.description')}</p>
                </div>
                <div className={styles.actionWrapper}>
                    <GoogleBtn />
                </div>
            </div>
        </div>
    );
};

export default GuestWarningBanner;

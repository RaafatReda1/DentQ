import React from 'react';
import { User } from 'lucide-react';
import styles from '../ProfilePage.module.css';
import GoogleBtn from '../../../Auth/GoogleBtn/GoogleBtn';
const GuestProfile = ({ t }) => {
    return (
        <div className={styles.guestContainer}>
            <div className={styles.guestIcon}>
                <User size={64} />
            </div>
            <h2 className={styles.guestTitle}>{t('profile.guest_title') || 'Welcome, Doctor'}</h2>
            <p className={styles.guestDesc}>
                {t('profile.guest_desc') || 'Please sign in to access your professional profile, order history, and saved addresses.'}
            </p>
                <GoogleBtn />
        </div>
    );
};

export default GuestProfile;

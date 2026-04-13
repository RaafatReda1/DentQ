import React from 'react';
import { Bell, MessageSquare, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchBar from './SubComponents/SearchBar';
import useUserData  from '../../../Storage/UserDataStorage';
import styles from './Header.module.css';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user } = useUserData(); // Extract for avatar loading

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(nextLang);
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <h2 className={styles.pageTitle}>{t('admin.sidebar.dashboard')}</h2>
                <SearchBar />
            </div>

            <div className={styles.rightSection}>
                {/* Communication and Alerts */}
                <div className={styles.iconGroup}>
                    <button className={styles.iconBtn} onClick={toggleLanguage} style={{fontWeight: 800, fontSize: '14px', color:'var(--primary-hover)'}}>
                        {i18n.language === 'ar' ? 'EN' : 'AR'}
                    </button>
                    <button className={styles.iconBtn}>
                        <MessageSquare size={20} />
                        <span className={styles.badge}>2</span>
                    </button>
                    <button className={styles.iconBtn}>
                        <Bell size={20} />
                        <span className={`${styles.badge} ${styles.alert}`}>15</span>
                    </button>
                </div>

                <div className={styles.divider}></div>

                {/* Profile Controls */}
                <div className={styles.profileSection}>
                    <div className={styles.profileInfo}>
                        <span className={styles.name}>{user?.fullName || "Admin"}</span>
                        <span className={styles.role}>{t('admin.header.super_admin')}</span>
                    </div>
                    <img 
                        src={user?.avatarUrl || "https://ui-avatars.com/api/?name=Admin&background=00b4d8&color=fff"} 
                        alt="Admin" 
                        className={styles.avatar} 
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;

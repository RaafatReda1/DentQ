import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import styles from '../DefaultHeroSection.module.css';

const HeroContent = ({ banner }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language.startsWith('en') ? 'en' : 'ar';

    // Use banner content if available, otherwise fall back to translations
    const headline = banner?.[`title_${lang}`] || t('hero.headline');
    const subText = banner?.[`subtitle_${lang}`] || t('hero.subText');
    const getStarted = t('hero.getStarted');
    const callUs = t('hero.callUs');

    return (
        <>
            <div className={styles.textContent}>
                <h1 className={styles.headline}>{headline}</h1>
                <p className={styles.subText}>{subText}</p>
            </div>

            <div className={styles.buttonsGroup}>
                <button className={styles.primaryBtn}>{getStarted}</button>
                <button className={styles.secondaryBtn}>
                    <div className={styles.iconCircle}>
                        <Phone size={18} />
                    </div>
                    {callUs}
                </button>
            </div>
        </>
    );
};

export default HeroContent;

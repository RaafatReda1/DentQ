import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import styles from '../DefaultHeroSection.module.css';
import { useNavigate } from 'react-router-dom';

const HeroContent = ({ banner }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language.startsWith('en') ? 'en' : 'ar';
    const navigate = useNavigate();
    // Use banner content if available, otherwise fall back to translations
    const headline = banner?.[`title_${lang}`] || t('hero.headline');
    const subText = banner?.[`subtitle_${lang}`] || t('hero.subText');
    const getStarted = t('hero.getStarted');
    const callUs = t('hero.callUs');

    const splitHeadLineTxt = (txt, part)=>{
        let mainArr = txt.split(/\s+/);
        if(part === 1){
            return mainArr[0] + ' ' + mainArr[1];
        }else{
            let segment = mainArr.slice(2)
            return segment.join(' ');
        }
    }
    return (
        <>
            <div className={styles.textContent}>
                <h1 className={styles.headline}><span className={styles.headLineSpan}>{splitHeadLineTxt(headline, 1)}</span> <span>{splitHeadLineTxt(headline, 2)}</span></h1>
                <p className={styles.subText}>{subText}</p>
            </div>

            <div className={styles.buttonsGroup}>
                <button className={styles.primaryBtn} onClick={() => navigate('/signin')}>{getStarted}</button>
                <button className={styles.secondaryBtn} onClick={() => navigate('/contact')}>
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

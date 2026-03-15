import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Stethoscope, Users } from 'lucide-react';
import styles from '../DefaultHeroSection.module.css';
import AnimatedCounter from './AnimatedCounter';

const HeroStats = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.statsRow}>
            <div className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                    <Building2 size={24} />
                </div>
                <div className={styles.statText}>
                    <h3 className={styles.statNumber}>
                        <AnimatedCounter end={50} suffix="+" />
                    </h3>
                    <p className={styles.statLabel}>{t('hero.clinics')}</p>
                </div>
            </div>

            <div className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                    <Stethoscope size={24} />
                </div>
                <div className={styles.statText}>
                    <h3 className={styles.statNumber}>
                        <AnimatedCounter end={2} suffix="K+" />
                    </h3>
                    <p className={styles.statLabel}>{t('hero.doctors')}</p>
                </div>
            </div>

            <div className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                    <Users size={24} />
                </div>
                <div className={styles.statText}>
                    <h3 className={styles.statNumber}>
                        <AnimatedCounter end={9} suffix="K+" />
                    </h3>
                    <p className={styles.statLabel}>{t('hero.patients')}</p>
                </div>
            </div>
        </div>
    );
};

export default HeroStats;

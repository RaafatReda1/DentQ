import React from 'react';
import styles from './AboutStats.module.css';

const AboutStats = ({ clinicsNum, clinicsLabel, distributorsNum, distributorsLabel, deliveriesNum, deliveriesLabel }) => {
    return (
        <div className={styles.statsRow}>
            <div className={styles.statCard}>
                <span className={styles.statNumber}>{clinicsNum}</span>
                <span className={styles.statLabel}>{clinicsLabel}</span>
            </div>
            <div className={styles.statCard}>
                <span className={styles.statNumber}>{distributorsNum}</span>
                <span className={styles.statLabel}>{distributorsLabel}</span>
            </div>
            <div className={styles.statCard}>
                <span className={styles.statNumber}>{deliveriesNum}</span>
                <span className={styles.statLabel}>{deliveriesLabel}</span>
            </div>
        </div>
    );
};

export default AboutStats;

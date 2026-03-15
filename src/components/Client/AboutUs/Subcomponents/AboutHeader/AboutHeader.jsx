import React from 'react';
import styles from './AboutHeader.module.css';

const AboutHeader = ({ title, subtitle }) => {
    return (
        <div className={styles.headerSection}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    );
};

export default AboutHeader;

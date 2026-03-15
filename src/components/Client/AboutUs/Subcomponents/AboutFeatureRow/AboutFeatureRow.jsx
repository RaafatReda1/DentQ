import React from 'react';
import styles from './AboutFeatureRow.module.css';
import useOnScreen from '../../useOnScreen';

const AboutFeatureRow = ({ title, text, imageSrc, imageAlt, isReversed, imageObjectPosition = "center", delay = '0s' }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

    return (
        <>
            {isReversed ? (
                <>
                    <div className={`${styles.imageWrapper} ${styles.reverseRow}`}>
                        <img src={imageSrc} alt={imageAlt} className={styles.featureImage} style={{ objectPosition: imageObjectPosition }} />
                    </div>
                    <div
                        ref={ref}
                        className={`${styles.textContent} ${styles.reverseRow}`}
                        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.8s ease', transitionDelay: delay }}
                    >
                        <h2 className={styles.heading}>{title}</h2>
                        <p className={styles.paragraph}>{text}</p>
                    </div>
                </>
            ) : (
                <>
                    <div
                        ref={ref}
                        className={styles.textContent}
                        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.8s ease', transitionDelay: delay }}
                    >
                        <h2 className={styles.heading}>{title}</h2>
                        <p className={styles.paragraph}>{text}</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img src={imageSrc} alt={imageAlt} className={styles.featureImage} style={{ objectPosition: imageObjectPosition }} />
                    </div>
                </>
            )}
        </>
    );
};

export default AboutFeatureRow;

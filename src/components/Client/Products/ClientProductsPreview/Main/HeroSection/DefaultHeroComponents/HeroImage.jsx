import React from 'react';
import styles from '../DefaultHeroSection.module.css';

const HeroImage = ({ banner }) => {
    // If Banner has an image from DB, use it, else default Image.
    const imageUrl = banner?.image || "/DefaultHeroSectionImg.png";

    return (
        <div className={styles.imageCol}>
            <div className={styles.imageContainer}>
                <div className={styles.imageBgShape}></div>
                <img
                    src={imageUrl}
                    alt="Group of Doctors"
                    className={styles.doctorsImage}
                />

                <div className={`${styles.floatingCircle} ${styles.circle1}`}></div>
                <div className={`${styles.floatingCircle} ${styles.circle2}`}></div>
            </div>
        </div>
    );
};

export default HeroImage;

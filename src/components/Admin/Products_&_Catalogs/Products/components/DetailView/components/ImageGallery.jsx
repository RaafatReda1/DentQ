import React from 'react';
import styles from './ImageGallery.module.css';

/**
 * ImageGallery component to display product images.
 */
const ImageGallery = ({ images }) => {
    return (
        <div className={styles.imagesRow}>
            {images && images.length > 0 ? (
                images.map((url, i) => (
                    <div key={i} className={styles.imageBox}>
                        <img 
                            src={url} 
                            alt="" 
                            className={styles.previewImg} 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.net/1.png'; }}
                        />
                    </div>
                ))
            ) : (
                <div className={styles.imageBox}>
                    <img 
                        src="https://placehold.net/1.png" 
                        alt="Placeholder" 
                        className={styles.previewImg} 
                    />
                </div>
            )}
        </div>
    );
};

export default ImageGallery;

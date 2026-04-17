import React from 'react';
import sharedStyles from '../Shared/Shared.module.css';
import styles from './MediaSection.module.css';
import ImageUploader from '../../ImageUploader/ImageUploader';

const MediaSection = ({ form, updateField, tp, productId }) => {
    return (
        <section className={sharedStyles.section}>
            <h3 className={sharedStyles.sectionTitle}>{tp('form_media')}</h3>
            
            <ImageUploader
                images={form.images}
                onChange={(imgs) => updateField('images', imgs)}
                productId={productId}
            />
            <p className={styles.hint}>{tp('form_images_stored')}</p>

            <div className={sharedStyles.formGroup}>
                <label className={sharedStyles.label}>{tp('form_video_url')}</label>
                <input
                    type="url"
                    value={form.videoUrl}
                    onChange={(e) => updateField('videoUrl', e.target.value)}
                    placeholder="https://..."
                    className={sharedStyles.input}
                />
            </div>
        </section>
    );
};

export default MediaSection;

import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import sharedStyles from '../Shared/Shared.module.css';
import styles from './ReviewDashboard.module.css';

const ReviewDashboard = ({ form, tp }) => {
    return (
        <div className={styles.dashboardSection}>
            <section className={sharedStyles.section}>
                <div className={styles.previewHeader}>
                    <h3 className={sharedStyles.sectionTitle}>{tp('form_review_title') || 'PRODUCT CONTENT REVIEW'}</h3>
                    <div className={styles.liveBadge}><span className={styles.pulse}></span> {tp('live_preview_status') || 'LIVE EDITOR SYNC'}</div>
                </div>
                
                <div className={styles.visualGrid}>
                    <div className={styles.visualPane}>
                        <div className={styles.visualHeader}>
                            <h4 className={styles.visualLabel}>English Visualization</h4>
                            <span className={styles.viewMeta}>Global Standard (LTR)</span>
                        </div>
                        <div className={styles.previewContent} data-color-mode="light">
                            <MDEditor.Markdown source={form.fullDescriptionEn} />
                        </div>
                    </div>
                    <div className={`${styles.visualPane} ${styles.rtlPane}`}>
                        <div className={styles.visualHeader}>
                            <h4 className={styles.visualLabel}>معاينة المحتوى العربي</h4>
                            <span className={styles.viewMeta}>RTL Directional Mockup</span>
                        </div>
                        <div className={`${styles.previewContent} ${styles.rtlContent}`} data-color-mode="light">
                            <MDEditor.Markdown source={form.fullDescriptionAr} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ReviewDashboard;

import React from 'react';
import styles from '../Shared/Shared.module.css';

const BasicInfo = ({ form, updateField, tp }) => {
    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{tp('form_basic_info')}</h3>

            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('form_name_en')}</label>
                <input
                    type="text"
                    value={form.nameEn}
                    onChange={(e) => updateField('nameEn', e.target.value)}
                    placeholder={tp('form_name_en_placeholder')}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('form_name_ar')}</label>
                <input
                    type="text"
                    value={form.nameAr}
                    onChange={(e) => updateField('nameAr', e.target.value)}
                    placeholder={tp('form_name_ar_placeholder')}
                    className={styles.input}
                    dir="rtl"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('form_desc_en')}</label>
                <textarea
                    value={form.descriptionEn}
                    onChange={(e) => updateField('descriptionEn', e.target.value)}
                    placeholder={tp('form_desc_en_placeholder')}
                    className={styles.textarea}
                    rows={3}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('form_desc_ar')}</label>
                <textarea
                    value={form.descriptionAr}
                    onChange={(e) => updateField('descriptionAr', e.target.value)}
                    placeholder={tp('form_desc_ar_placeholder')}
                    className={styles.textarea}
                    dir="rtl"
                    rows={3}
                />
            </div>
        </section>
    );
};

export default BasicInfo;

import React from 'react';
import styles from './CatalogModalForm.module.css';

/**
 * Main form content section of the Catalog Modal.
 */
const CatalogModalForm = ({ form, updateField, validParents, loading, tp, i18n }) => {
    return (
        <div className={styles.formContent}>
            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('name_en')}</label>
                <input type="text" value={form.name_en} onChange={(e) => updateField('name_en', e.target.value)} required className={styles.input} disabled={loading} />
            </div>
            
            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('name_ar')}</label>
                <input type="text" value={form.name_ar} onChange={(e) => updateField('name_ar', e.target.value)} className={styles.input} dir="rtl" disabled={loading} />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('slug')}</label>
                <input type="text" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} required className={styles.input} disabled={loading} placeholder="e.g. parent-slug/child-slug" />
                <small className={styles.hint}>{tp('slug_hint')}</small>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>{tp('parent')}</label>
                <select value={form.parent_id} onChange={(e) => updateField('parent_id', e.target.value)} className={styles.select} disabled={loading}>
                    <option value="">-- {tp('root_category')} --</option>
                    {validParents.map(c => (
                        <option key={c.id} value={c.id}>
                            {'— '.repeat(c.level)}{i18n.language === 'ar' ? (c.name_ar || c.name_en) : (c.name_en || c.name_ar)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CatalogModalForm;

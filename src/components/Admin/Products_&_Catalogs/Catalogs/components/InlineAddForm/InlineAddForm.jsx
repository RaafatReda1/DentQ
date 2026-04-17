import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import styles from './InlineAddForm.module.css';
import { useInlineAdd } from './useInlineAdd';

/**
 * Inline form to quickly add a sub-category under a specific parent.
 */
const InlineAddForm = ({ parentId, parentSlug, allFilteredCats, onSave, onCancel }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);
    const { nameEn, setNameEn, nameAr, setNameAr, loading, handleSubmit } = 
        useInlineAdd({ parentId, parentSlug, allFilteredCats, onSave });

    return (
        <div className={styles.inlineFormWrapper}>
            <div className={styles.bridgeLine}></div>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.inputsRow}>
                    <input type="text" placeholder={tp('name_en_placeholder')} value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                           className={styles.input} required autoFocus disabled={loading} />
                    <input type="text" placeholder={tp('name_ar_placeholder')} value={nameAr} onChange={(e) => setNameAr(e.target.value)}
                           className={styles.input} dir="rtl" disabled={loading} />
                </div>
                <div className={styles.actions}>
                    <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={loading}><X size={16} /></button>
                    <button type="submit" className={styles.saveBtn} disabled={loading || !nameEn.trim()}>
                        {loading ? <span className={styles.spinner}></span> : <Check size={16} />}
                        <span>{tp('save')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InlineAddForm;

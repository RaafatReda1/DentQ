import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import styles from './InlineAddForm.module.css';
import { computeLevel, computeSlug } from '../lib/catalogHelpers';

const InlineAddForm = ({ parentId, parentSlug, allFilteredCats, onSave, onCancel }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nameEn.trim()) return;

        setLoading(true);
        try {
            const level = computeLevel(parentId, allFilteredCats);
            const slug = computeSlug(nameEn.trim(), parentSlug);
            
            // To position at bottom of the specific parent level:
            // We find siblings and get max sort_order
            const siblings = allFilteredCats.filter(c => c.parent_id === parentId);
            const maxSort = siblings.length > 0 ? Math.max(...siblings.map(s => s.sort_order || 0)) : 0;

            const payload = {
                name_en: nameEn.trim(),
                name_ar: nameAr.trim() || null,
                parent_id: parentId,
                level,
                slug,
                sort_order: maxSort + 1,
                is_active: true
            };

            await onSave(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.inlineFormWrapper}>
            <div className={styles.bridgeLine}></div>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.inputsRow}>
                    <input
                        type="text"
                        placeholder={tp('name_en_placeholder') || 'Category Name (EN)'}
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        className={styles.input}
                        required
                        autoFocus
                        disabled={loading}
                    />
                    <input
                        type="text"
                        placeholder={tp('name_ar_placeholder') || 'اسم الفئة (AR)'}
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        className={styles.input}
                        dir="rtl"
                        disabled={loading}
                    />
                </div>
                
                <div className={styles.actions}>
                    <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={loading}>
                        <X size={16} />
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={loading || !nameEn.trim()}>
                        {loading ? <span className={styles.spinner}></span> : <Check size={16} />}
                        <span>{tp('save') || 'Save'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InlineAddForm;

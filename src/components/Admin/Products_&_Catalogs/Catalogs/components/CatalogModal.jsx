import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './CatalogModal.module.css';
import { computeLevel, computeSlug } from '../lib/catalogHelpers';

const CatalogModal = ({ isOpen, category, allFilteredCats, onSave, onClose }) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);
    
    const isEditing = !!category;

    const [form, setForm] = useState({
        name_en: '',
        name_ar: '',
        slug: '',
        parent_id: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setForm({
                name_en: category.name_en || '',
                name_ar: category.name_ar || '',
                slug: category.slug || '',
                parent_id: category.parent_id || ''
            });
        } else {
            setForm({
                name_en: '',
                name_ar: '',
                slug: '',
                parent_id: ''
            });
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    // Filter valid parents to prevent circular loops (can't attach to your own descendant)
    // Simplifying here to just any category that is NOT itself
    const validParents = allFilteredCats.filter(c => c.id !== category?.id && c.level < 2);

    const updateField = (field, value) => {
        setForm(prev => {
            const next = { ...prev, [field]: value };
            // If we are updating Name_EN or Parent ID, auto-compute the slug. (Editable manually too)
            if (field === 'name_en' || field === 'parent_id') {
                const parentNode = allFilteredCats.find(c => c.id === next.parent_id);
                next.slug = computeSlug(next.name_en, parentNode?.slug);
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const level = computeLevel(form.parent_id || null, allFilteredCats);
            const parentId = form.parent_id || null;

            let sort_order = category?.sort_order || 1;
            
            // If moving to a new parent, put it at the end
            if (!isEditing || category.parent_id !== parentId) {
                const siblings = allFilteredCats.filter(c => c.parent_id === parentId);
                sort_order = siblings.length > 0 ? Math.max(...siblings.map(s => s.sort_order || 0)) + 1 : 1;
            }

            const payload = {
                name_en: form.name_en.trim(),
                name_ar: form.name_ar.trim() || null,
                slug: form.slug.trim(),
                parent_id: parentId,
                level,
                sort_order
            };

            await onSave(payload, category?.id);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {isEditing ? tp('edit_catalog') || 'Edit Catalog' : tp('add_root') || 'Add Root Catalog'}
                    </h3>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{tp('name_en') || 'Name (En)'}</label>
                        <input
                            type="text"
                            value={form.name_en}
                            onChange={(e) => updateField('name_en', e.target.value)}
                            required
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{tp('name_ar') || 'Name (Ar)'}</label>
                        <input
                            type="text"
                            value={form.name_ar}
                            onChange={(e) => updateField('name_ar', e.target.value)}
                            className={styles.input}
                            dir="rtl"
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{tp('slug') || 'Slug URL'}</label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => updateField('slug', e.target.value)}
                            required
                            className={styles.input}
                            disabled={loading}
                            placeholder="e.g. parent-slug/child-slug"
                        />
                        <small className={styles.hint}>{tp('slug_hint') || 'Auto-generated but editable.'}</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{tp('parent') || 'Parent Category (Move)'}</label>
                        <select
                            value={form.parent_id}
                            onChange={(e) => updateField('parent_id', e.target.value)}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">-- {tp('root_category') || 'Set as Root Category'} --</option>
                            {validParents.map(c => {
                                const indent = '— '.repeat(c.level);
                                const name = i18n.language === 'ar' ? (c.name_ar || c.name_en) : (c.name_en || c.name_ar);
                                return (
                                    <option key={c.id} value={c.id}>
                                        {indent}{name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                            {tp('cancel') || 'Cancel'}
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={loading || !form.name_en.trim()}>
                            {loading ? tp('saving') || 'Saving...' : tp('save') || 'Save Catalog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CatalogModal;

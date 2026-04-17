import { useState, useEffect } from 'react';
import { computeSlug } from '../../../../Products_&_Catalogs/Catalogs/lib/catalogHelpers';
import { handleCatalogSubmit } from './handleCatalogSubmit';

export function useCatalogModal({ category, allFilteredCats, onSave, isOpen }) {
    const isEditing = !!category;
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name_en: '', name_ar: '', slug: '', parent_id: ''});

    useEffect(() => {
        if (category) setForm({ name_en: category.name_en || '', name_ar: category.name_ar || '', slug: category.slug || '', parent_id: category.parent_id || '' });
        else setForm({ name_en: '', name_ar: '', slug: '', parent_id: '' });
    }, [category, isOpen]);

    const validParents = allFilteredCats.filter(c => c.id !== category?.id && c.level < 2);

    const updateField = (field, value) => {
        setForm(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'name_en' || field === 'parent_id') {
                const parentNode = allFilteredCats.find(c => c.id === next.parent_id);
                next.slug = computeSlug(next.name_en, parentNode?.slug);
            }
            return next;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCatalogSubmit({ form, category, allFilteredCats, onSave, setLoading, isEditing });
    };

    return { form, isEditing, loading, validParents, updateField, handleSubmit };
}

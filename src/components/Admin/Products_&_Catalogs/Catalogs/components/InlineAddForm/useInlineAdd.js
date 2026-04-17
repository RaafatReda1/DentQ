import { useState } from 'react';
import { computeLevel, computeSlug } from '../../lib/catalogHelpers';

/**
 * Logic hook for the Inline Add Form.
 */
export const useInlineAdd = ({ parentId, parentSlug, allFilteredCats, onSave }) => {
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
            const siblings = allFilteredCats.filter(c => c.parent_id === parentId);
            const maxSort = siblings.length > 0 
                ? Math.max(...siblings.map(s => s.sort_order || 0)) 
                : 0;

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

    return { nameEn, setNameEn, nameAr, setNameAr, loading, handleSubmit };
};

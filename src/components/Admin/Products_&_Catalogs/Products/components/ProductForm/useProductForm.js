import { useState, useEffect } from 'react';

/**
 * Initial empty shape of the product form.
 * Ensures controlled React inputs do not throw warnings.
 */
const INITIAL_FORM = {
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    fullDescriptionEn: '',
    fullDescriptionAr: '',
    price: '',
    original_price: '',
    discount: '',
    cost: '',
    profit: '',
    stock: '',
    category_id: '',
    sizes: [],
    colors: [],
    images: [],
    videoUrl: '',
    is_active: true,
    is_featured: false,
    is_trending: false,
};

/**
 * Custom hook to isolate all state, math, and submission logic away from the UI.
 * 
 * @param {Object} product - The pre-existing product if in Edit mode, null if creating new.
 * @param {boolean} isOpen - Boolean indicating if the modal/form is actively open.
 * @param {Function} onSave - Callback triggered upon passing validation to save/publish data.
 * @returns {Object} { form, updateField, initSubmit } - State variables and handlers.
 */
export const useProductForm = (product, isOpen, onSave) => {
    const [form, setForm] = useState(INITIAL_FORM);

    // Pre-fill the form whenever the active product changes or the modal opens
    useEffect(() => {
        if (product) {
            setForm({
                nameEn: product.nameEn || '',
                nameAr: product.nameAr || '',
                descriptionEn: product.descriptionEn || '',
                descriptionAr: product.descriptionAr || '',
                fullDescriptionEn: product.fullDescriptionEn || '',
                fullDescriptionAr: product.fullDescriptionAr || '',
                price: product.price || '',
                original_price: product.original_price || '',
                discount: product.discount || '',
                cost: product.cost || '',
                profit: product.profit || '',
                stock: product.stock ?? '',
                category_id: product.category_id || '',
                sizes: product.sizes || [],
                colors: product.colors || [],
                images: product.images || [],
                videoUrl: product.videoUrl || '',
                is_active: product.is_active ?? true,
                is_featured: product.is_featured ?? false,
                is_trending: product.is_trending ?? false,
            });
        } else {
            setForm(INITIAL_FORM);
        }
    }, [product, isOpen]);

    /**
     * Updates an individual field within the form state.
     * Automatically triggers re-calculation of pricing data based on cost/discount.
     * 
     * @param {string} field - The property key inside the form object.
     * @param {any} value - The new value to set.
     */
    const updateField = (field, value) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value };

            // Auto-calculate Price and Profit margin logically using readable variables
            const originalPrice = Number(updated.original_price || 0);
            const discountPercentage = Number(updated.discount || 0);
            const costPrice = Number(updated.cost || 0);

            if (originalPrice > 0) {
                // Sale Price = Original - (Original * Discount%)
                const salePrice = originalPrice - (originalPrice * (discountPercentage / 100));
                updated.price = salePrice.toFixed(2);

                // Profit = Sale Price - Cost
                updated.profit = (salePrice - costPrice).toFixed(2);
            } else {
                updated.price = '';
                updated.profit = '';
            }

            return updated;
        });
    };

    /**
     * Formats the raw state object to strictly match Database column structures.
     * Trims whitespace and strips empty arrays/strings to null.
     * 
     * @param {boolean} isDraft - Flag dictating whether the product skips publishing (`is_active` defaults false).
     */
    const initSubmit = (isDraft) => {
        const isEditing = !!product;

        const data = {
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim() || null,
            descriptionEn: form.descriptionEn.trim() || null,
            descriptionAr: form.descriptionAr.trim() || null,
            fullDescriptionEn: form.fullDescriptionEn.trim() || null,
            fullDescriptionAr: form.fullDescriptionAr.trim() || null,
            price: Number(form.price) || 0,
            original_price: form.original_price ? Number(form.original_price) : null,
            discount: form.discount ? Number(form.discount) : null,
            cost: form.cost ? Number(form.cost) : null,
            profit: form.profit ? Number(form.profit) : 0,
            stock: form.stock !== '' ? Number(form.stock) : 0,
            category_id: form.category_id || null,
            sizes: form.sizes.length > 0 ? form.sizes : null,
            colors: form.colors.length > 0 ? form.colors : null,
            images: form.images,
            videoUrl: form.videoUrl.trim() || null,
            is_active: isDraft ? false : form.is_active,
            is_featured: form.is_featured,
            is_trending: form.is_trending,
        };

        // Pass to the parent HOC (Higher-Order Component) -> Products.jsx
        onSave(data, !isDraft && !isEditing ? false : isDraft);
    };

    return { form, updateField, initSubmit };
};

import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Logic Hook
import { useProductForm } from './useProductForm';

// Sections (Cleanly imported from sections/index.js)
import {
    BasicInfo,
    PricingInventory,
    Organization,
    MediaSection,
    FlagsSection,
    DescriptionEditor,
    ReviewDashboard
} from './sections';

import styles from './ProductForm.module.css';

// MDE Styles
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

/**
 * ProductForm UI Wrapper
 * Extremely clean architecture: State logic is handled by `useProductForm`.
 * Section renders are abstracted to `sections/`.
 */
const ProductForm = ({ isOpen, product, categories = [], onSave, onClose, loading }) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const isEditing = !!product;

    // Utilize custom hook to absorb state complexity
    const { form, updateField, initSubmit } = useProductForm(product, isOpen, onSave);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.formHeader}>
                    <div>
                        <h2 className={styles.formTitle}>
                            {isEditing ? tp('form_edit_title') : tp('form_add_title')}
                        </h2>
                        <p className={styles.formSubtitle}>{tp('form_required')}</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.draftBtn}
                            onClick={() => initSubmit(true)}
                            disabled={loading || !form.nameEn.trim() || !form.price}
                        >
                            {tp('form_save_draft')}
                        </button>
                        <button
                            className={styles.publishBtn}
                            onClick={() => initSubmit(false)}
                            disabled={loading || !form.nameEn.trim() || !form.price}
                        >
                            {loading ? tp('form_saving') : isEditing ? tp('form_update') : tp('form_publish')}
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.formBody}>
                    <div className={styles.formColumns}>
                        <div className={styles.mainColumn}>
                            <BasicInfo form={form} updateField={updateField} tp={tp} />
                            <PricingInventory form={form} updateField={updateField} tp={tp} />
                            <Organization form={form} updateField={updateField} tp={tp} categories={categories} currentLang={i18n.language} />
                        </div>

                        <div className={styles.sideColumn}>
                            <MediaSection form={form} updateField={updateField} tp={tp} productId={product?.id} />
                            <FlagsSection form={form} updateField={updateField} tp={tp} />
                            <DescriptionEditor form={form} updateField={updateField} tp={tp} />
                        </div>
                    </div>

                    <ReviewDashboard form={form} tp={tp} />
                </div>

                {/* Footer */}
                <div className={styles.formFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>{tp('cancel')}</button>
                    <button
                        className={styles.draftBtn}
                        onClick={() => initSubmit(true)}
                        disabled={loading || !form.nameEn.trim() || !form.price}
                    >
                        {tp('form_save_draft')}
                    </button>
                    <button
                        className={styles.publishBtn}
                        onClick={() => initSubmit(false)}
                        disabled={loading || !form.nameEn.trim() || !form.original_price || !form.cost}
                    >
                        {loading ? tp('form_saving') : isEditing ? tp('form_update') : tp('form_publish')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;

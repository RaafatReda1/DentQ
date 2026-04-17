import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CatalogModal.module.css';
import { useCatalogModal } from './useCatalogModal';
import CatalogModalHeader from './CatalogModalHeader';
import CatalogModalForm from './CatalogModalForm';
import CatalogModalFooter from './CatalogModalFooter';

const CatalogModal = ({ isOpen, category, allFilteredCats, onSave, onClose }) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);
    
    const { form, isEditing, loading, validParents, updateField, handleSubmit } = 
        useCatalogModal({ category, allFilteredCats, onSave, isOpen });

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <CatalogModalHeader isEditing={isEditing} tp={tp} onClose={onClose} />
                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    <CatalogModalForm form={form} updateField={updateField} validParents={validParents} loading={loading} tp={tp} i18n={i18n} />
                    <CatalogModalFooter loading={loading} isValid={form.name_en.trim().length > 0} tp={tp} onClose={onClose} />
                </form>
            </div>
        </div>
    );
};

export default CatalogModal;

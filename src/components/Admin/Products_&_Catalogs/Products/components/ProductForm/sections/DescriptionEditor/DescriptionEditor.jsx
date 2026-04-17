import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import sharedStyles from '../Shared/Shared.module.css';
import styles from './DescriptionEditor.module.css';

const DescriptionEditor = ({ form, updateField, tp }) => {
    return (
        <section className={sharedStyles.section}>
            <h3 className={sharedStyles.sectionTitle}>{tp('form_full_desc')}</h3>

            <div className={sharedStyles.formGroup}>
                <label className={sharedStyles.label}>{tp('form_full_desc_en')}</label>
                <div className={styles.mdeContainer} data-color-mode="light">
                    <MDEditor
                        value={form.fullDescriptionEn}
                        onChange={(val) => updateField('fullDescriptionEn', val || '')}
                        preview="edit"
                        height={180}
                    />
                </div>
            </div>

            <div className={sharedStyles.formGroup}>
                <label className={sharedStyles.label}>{tp('form_full_desc_ar')}</label>
                <div className={`${styles.mdeContainer} ${styles.rtlMde}`} data-color-mode="light">
                    <MDEditor
                        value={form.fullDescriptionAr}
                        onChange={(val) => updateField('fullDescriptionAr', val || '')}
                        preview="edit"
                        height={180}
                    />
                </div>
            </div>
        </section>
    );
};

export default DescriptionEditor;

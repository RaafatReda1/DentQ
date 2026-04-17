import React from 'react';
import sharedStyles from '../Shared/Shared.module.css';
import TagInput from '../../TagInput/TagInput';

const Organization = ({ form, updateField, tp, categories, currentLang }) => {
    return (
        <section className={sharedStyles.section}>
            <h3 className={sharedStyles.sectionTitle}>{tp('form_organization')}</h3>

            <div className={sharedStyles.formGroup}>
                <label className={sharedStyles.label}>{tp('form_category')}</label>
                <select
                    value={form.category_id}
                    onChange={(e) => updateField('category_id', e.target.value)}
                    className={sharedStyles.select}
                >
                    <option value="">{tp('form_select_category')}</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {currentLang === 'ar' ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar)}
                        </option>
                    ))}
                </select>
            </div>

            <TagInput
                label={tp('form_sizes')}
                tags={form.sizes}
                onChange={(tags) => updateField('sizes', tags)}
                placeholder={tp('form_add_size')}
            />

            <TagInput
                label={tp('form_colors')}
                tags={form.colors}
                onChange={(tags) => updateField('colors', tags)}
                placeholder={tp('form_add_color')}
                isColor
            />
        </section>
    );
};

export default Organization;

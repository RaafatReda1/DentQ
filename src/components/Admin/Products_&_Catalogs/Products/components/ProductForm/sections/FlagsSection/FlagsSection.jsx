import React from 'react';
import sharedStyles from '../Shared/Shared.module.css';
import styles from './FlagsSection.module.css';

const FlagsSection = ({ form, updateField, tp }) => {
    return (
        <section className={sharedStyles.section}>
            <h3 className={sharedStyles.sectionTitle}>{tp('form_flags')}</h3>
            <div className={styles.flagsList}>
                {[
                    { field: 'is_active', label: tp('toggle_active') },
                    { field: 'is_featured', label: tp('toggle_featured') },
                    { field: 'is_trending', label: tp('toggle_trending') },
                ].map(({ field, label }) => (
                    <div key={field} className={styles.flagRow}>
                        <span className={styles.flagLabel}>{label}</span>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={form[field]}
                                onChange={(e) => updateField(field, e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                ))}
            </div>
            <p className={styles.flagsHint}>{tp('form_flags_hint')}</p>
        </section>
    );
};

export default FlagsSection;

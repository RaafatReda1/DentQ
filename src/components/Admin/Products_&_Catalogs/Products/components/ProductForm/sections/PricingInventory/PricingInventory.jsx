import React from 'react';
import sharedStyles from '../Shared/Shared.module.css';
import styles from './PricingInventory.module.css';

const PricingInventory = ({ form, updateField, tp }) => {
    return (
        <section className={sharedStyles.section}>
            <h3 className={sharedStyles.sectionTitle}>{tp('form_pricing')}</h3>

            <div className={sharedStyles.formGroup}>
                <label className={sharedStyles.label}>{tp('form_price_label')}</label>
                <div className={styles.priceRow}>
                    <div className={styles.formInsideGroup}>
                        <small className={styles.inputHint}>{tp('form_cost')}</small>
                        <input
                            type="number"
                            value={form.cost}
                            onChange={(e) => updateField('cost', e.target.value)}
                            placeholder="$0.00"
                            className={sharedStyles.input}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className={styles.formInsideGroup}>
                        <small className={styles.inputHint}>{tp('col_price')} {tp('form_sale_label')}</small>
                        <input
                            type="text"
                            value={form.price}
                            readOnly
                            className={`${sharedStyles.input} ${styles.readOnlyInput}`}
                            placeholder="$0.00"
                        />
                    </div>
                    <div className={styles.formInsideGroup}>
                        <small className={styles.inputHint}>{tp('form_original_price_hint')}</small>
                        <input
                            type="number"
                            value={form.original_price}
                            onChange={(e) => updateField('original_price', e.target.value)}
                            placeholder="$0.00"
                            className={sharedStyles.input}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className={styles.formInsideGroup}>
                        <small className={styles.inputHint}>{tp('form_discount_hint')}</small>
                        <input
                            type="number"
                            value={form.discount}
                            onChange={(e) => updateField('discount', e.target.value)}
                            placeholder="0%"
                            className={sharedStyles.input}
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </div>

            <div className={sharedStyles.formGroup}>
                <label className={sharedStyles.label}>{tp('form_profit')}</label>
                <input
                    type="text"
                    value={form.profit}
                    readOnly
                    className={`${sharedStyles.input} ${styles.readOnlyInput} ${Number(form.profit) < 0 ? styles.lossValue : ''}`}
                    placeholder={tp('form_profit_placeholder')}
                />
            </div>

            <div className={sharedStyles.formGroup}>
                <label className={sharedStyles.label}>{tp('form_stock')}</label>
                <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => updateField('stock', e.target.value)}
                    placeholder="0"
                    className={sharedStyles.input}
                    min="0"
                    required
                />
            </div>
        </section>
    );
};

export default PricingInventory;

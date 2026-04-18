import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOrdersStore } from '../../store/useOrdersStore';
import { statusOptions, paymentOptions, governorates } from '../../constants/filters';
import styles from './FiltersBar.module.css';

const FiltersBar = () => {
    const { t, i18n } = useTranslation();
    const { filters, setFilters } = useOrdersStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ [name]: value });
    };

    return (
        <div className={styles.container}>
            <select name="status" value={filters.status} onChange={handleChange} className={styles.select}>
                <option value="">{t('admin.orders.filters.status', 'All Statuses')}</option>
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <select name="payment" value={filters.payment} onChange={handleChange} className={styles.select}>
                <option value="">{t('admin.orders.filters.payment', 'All Payments')}</option>
                {paymentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <select name="governorate" value={filters.governorate} onChange={handleChange} className={styles.select}>
                <option value="">{t('admin.orders.filters.gov', 'All Governorates')}</option>
                {governorates.map(gov => (
                    <option key={gov.id} value={gov.id}>
                        {i18n.language === 'ar' ? gov.nameAr : gov.nameEn}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FiltersBar;

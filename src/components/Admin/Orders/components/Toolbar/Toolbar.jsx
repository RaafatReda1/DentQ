import React from 'react';
import { useTranslation } from 'react-i18next';
import ViewToggle from './ViewToggle';
import FiltersBar from './FiltersBar';
import SearchBar from '../../../Layout/Header/SubComponents/SearchBar';
import styles from './Toolbar.module.css';

/**
 * Top-level Toolbar for Orders Management.
 * Handles Global search, view switching, and filters.
 */
const Toolbar = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.wrapper}>
            <div className={styles.topRow}>
                <h2 className={styles.title}>{t('admin.orders.title', 'Orders Management')}</h2>
                <ViewToggle />
            </div>
            
            <div className={styles.bottomRow}>
                <div className={styles.searchSection}>
                    <SearchBar />
                </div>
                <div className={styles.filterSection}>
                    <FiltersBar />
                </div>
            </div>
        </section>
    );
};

export default Toolbar;

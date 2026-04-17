import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryFilters.module.css';

const CategoryFilters = ({ filters, setFilters, search, setSearch }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);

    return (
        <div className={styles.filtersContainer}>
            <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={tp('search_placeholder') || 'Search catalogs...'}
                    className={styles.searchInput}
                />
            </div>
            
            <div className={styles.dropdowns}>
                <select
                    value={filters.level}
                    onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                    className={styles.select}
                >
                    <option value="all">{tp('filter_all_levels') || 'All Levels'}</option>
                    <option value="0">{tp('filter_root') || 'Root Only'}</option>
                    <option value="1">{tp('filter_sub') || 'Sub Categories'}</option>
                    <option value="2">{tp('filter_deep') || 'Deep Categories'}</option>
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className={styles.select}
                >
                    <option value="all">{tp('filter_all_status') || 'All Status'}</option>
                    <option value="active">{tp('filter_active') || 'Active'}</option>
                    <option value="inactive">{tp('filter_inactive') || 'Inactive'}</option>
                </select>
            </div>
        </div>
    );
};

export default CategoryFilters;

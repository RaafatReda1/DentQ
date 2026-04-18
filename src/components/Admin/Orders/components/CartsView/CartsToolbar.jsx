import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOrdersStore } from '../../store/useOrdersStore';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import styles from './CartsToolbar.module.css';

const CartsToolbar = () => {
    const { t } = useTranslation();
    const { filters, setFilter, resetFilters } = useOrdersStore();

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <div className={styles.searchBox}>
                    <Search className={styles.searchIcon} size={18} />
                    <input 
                        type="text" 
                        placeholder={t('admin.carts.search_placeholder', 'Search user, email or ID...')}
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                    />
                </div>
                
                <div className={styles.viewToggle}>
                    <button 
                        className={`${styles.toggleBtn} ${filters.cartView !== 'table' ? styles.active : ''}`}
                        onClick={() => setFilter('cartView', 'grid')}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        className={`${styles.toggleBtn} ${filters.cartView === 'table' ? styles.active : ''}`}
                        onClick={() => setFilter('cartView', 'table')}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.filtersRow}>
                <div className={styles.filterGroup}>
                    <label>{t('admin.carts.filters.sort', 'Sort By')}</label>
                    <select value={filters.cartSort} onChange={(e) => setFilter('cartSort', e.target.value)}>
                        <option value="recent">{t('admin.carts.sort.recent', 'Recently Updated')}</option>
                        <option value="value">{t('admin.carts.sort.value', 'Highest Value')}</option>
                        <option value="items">{t('admin.carts.sort.items', 'Most Items')}</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>{t('admin.carts.filters.type', 'User Type')}</label>
                    <select value={filters.clientType} onChange={(e) => setFilter('clientType', e.target.value)}>
                        <option value="all">{t('admin.carts.type.all', 'All Users')}</option>
                        <option value="guest">{t('admin.carts.type.guest', 'Guests Only')}</option>
                        <option value="registered">{t('admin.carts.type.registered', 'Registered Only')}</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label>{t('admin.carts.filters.min_value', 'Min Value')}</label>
                    <div className={styles.priceInput}>
                        <input 
                            type="number" 
                            placeholder="0"
                            value={filters.minPrice || ''}
                            onChange={(e) => setFilter('minPrice', Number(e.target.value))}
                        />
                        <span className={styles.currency}>EGP</span>
                    </div>
                </div>

                <button className={styles.resetBtn} onClick={resetFilters}>
                    <SlidersHorizontal size={14} /> {t('admin.orders.filters.reset', 'Reset')}
                </button>
            </div>
        </div>
    );
};

export default CartsToolbar;

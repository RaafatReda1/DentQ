import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../../../utils/SupabaseClient'; // Relative adjust to your Supabase
import styles from './SearchBar.module.css';

const SearchBar = () => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ products: [], clients: [], orders: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (!query.trim()) {
                setResults({ products: [], clients: [], orders: [] });
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            setShowDropdown(true);

            try {
                const [prodRes, clientRes, orderRes] = await Promise.all([
                    supabase.from('Products').select('id, nameEn').ilike('nameEn', `%${query}%`).limit(3),
                    supabase.from('Clients').select('id, email, fullName').ilike('email', `%${query}%`).limit(3),
                    // If order IDs are UUIDs, ilike search is tricky. Assumes UUID exact match or full_name search
                    supabase.from('Orders').select('id, full_name').ilike('full_name', `%${query}%`).limit(3)
                ]);

                setResults({
                    products: prodRes.data || [],
                    clients: clientRes.data || [],
                    orders: orderRes.data || []
                });
            } catch (err) {
                console.error("Omni-Search Error:", err);
            }
            setIsSearching(false);
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(`.${styles.searchContainer}`)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const hasResults = results.products.length > 0 || results.clients.length > 0 || results.orders.length > 0;

    return (
        <div className={styles.searchContainer}>
            <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                    type="text" 
                    placeholder={t('admin.search.placeholder')} 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.searchInput}
                    onFocus={() => query.trim() && setShowDropdown(true)}
                />
                {isSearching && <div className={styles.spinner}></div>}
            </div>

            {showDropdown && (
                <div className={styles.dropdown}>
                    {!isSearching && !hasResults ? (
                        <div className={styles.noResults}>{t('admin.search.no_results')}</div>
                    ) : (
                        <div className={styles.resultsList}>
                            {results.products.length > 0 && (
                                <div className={styles.resultGroup}>
                                    <h4>{t('admin.sidebar.products')}</h4>
                                    {results.products.map(p => <div key={p.id} className={styles.resultItem}>{p.nameEn}</div>)}
                                </div>
                            )}
                            {results.clients.length > 0 && (
                                <div className={styles.resultGroup}>
                                    <h4>Users</h4>
                                    {results.clients.map(c => <div key={c.id} className={styles.resultItem}>{c.email}</div>)}
                                </div>
                            )}
                            {results.orders.length > 0 && (
                                <div className={styles.resultGroup}>
                                    <h4>{t('admin.sidebar.orders')}</h4>
                                    {results.orders.map(o => <div key={o.id} className={styles.resultItem}>{o.full_name}</div>)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

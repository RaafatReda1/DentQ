import React, { useState, useEffect, useMemo } from 'react';
import { Search, Package, User, ShoppingCart, Truck, ExternalLink, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../../utils/SupabaseClient';
import { useOrdersStore } from '../../../Orders/store/useOrdersStore';
import { useOrdersQuery } from '../../../Orders/hooks/useOrdersQuery';
import styles from './SearchBar.module.css';

const SearchBar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { setView, setActiveOrder, setFilter } = useOrdersStore();
    const { rawOrders } = useOrdersQuery(); // Access local cache for smart partial-ID matching
    
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ products: [], clients: [], orders: [], carts: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const cleanQuery = query.trim().toLowerCase();
            if (!cleanQuery) {
                setResults({ products: [], clients: [], orders: [], carts: [] });
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            setShowDropdown(true);

            try {
                // 1. Smart Local Search (Matches partial UUIDs correctly)
                const localOrders = rawOrders.filter(o => 
                    o.id.toLowerCase().includes(cleanQuery) || 
                    o.full_name?.toLowerCase().includes(cleanQuery) ||
                    o.phone_number?.includes(cleanQuery)
                ).slice(0, 5);

                // 2. Global Cloud Search (Clients, Products, Carts)
                const [prodRes, clientRes, cartRes] = await Promise.all([
                    supabase.from('Products').select('id, nameEn, nameAr').or(`nameEn.ilike.%${cleanQuery}%,nameAr.ilike.%${cleanQuery}%`).limit(3),
                    supabase.from('Clients').select('id, email, fullName, phone').or(`fullName.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%,phone.ilike.%${cleanQuery}%`).limit(3),
                    supabase.from('Carts').select('id, client_id').ilike('id', `%${cleanQuery}%`).limit(3)
                ]);

                setResults({
                    products: prodRes.data || [],
                    clients: clientRes.data || [],
                    orders: localOrders, // Use local smart-search results
                    carts: cartRes.data || []
                });
            } catch (err) {
                console.error("Omni-Search Error:", err);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, rawOrders]);

    const handleNavigate = (type, item) => {
        setShowDropdown(false);
        setQuery('');

        switch (type) {
            case 'order':
                navigate('/admin/orders');
                setActiveOrder(item.id);
                setView('detail');
                break;
            case 'cart':
                navigate('/admin/orders');
                setView('carts');
                setFilter('search', item.id);
                break;
            case 'client':
                navigate('/admin/orders');
                setView('carts');
                setFilter('search', item.fullName || item.email);
                break;
            case 'product':
                navigate(`/admin/products?search=${item.id}`);
                break;
            default: break;
        }
    };

    const ResultItem = ({ icon: Icon, title, sub, onClick, typeLabel }) => (
        <div className={styles.resultItem} onClick={onClick}>
            <div className={styles.itemIcon}><Icon size={16} /></div>
            <div className={styles.itemInfo}>
                <p className={styles.itemTitle}>{title}</p>
                <p className={styles.itemSub}>{sub}</p>
            </div>
            {typeLabel && <span className={styles.typeTag}>{typeLabel}</span>}
            <ExternalLink size={12} className={styles.linkIcon} />
        </div>
    );

    const hasResults = Object.values(results).some(arr => arr.length > 0);

    return (
        <div className={styles.searchContainer}>
            <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                    type="text" 
                    placeholder={t('admin.search.placeholder', 'Search Orders, Users, Products...')} 
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
                        <div className={styles.noResults}>{t('admin.search.no_results', 'No matches found')}</div>
                    ) : (
                        <div className={styles.resultsList}>
                            {results.orders.map(o => (
                                <ResultItem key={o.id} icon={Truck} title={o.full_name} sub={`#...${o.id.slice(-8)}`} onClick={() => handleNavigate('order', o)} typeLabel="ORDER" />
                            ))}
                            {results.carts.map(c => (
                                <ResultItem key={c.id} icon={History} title={`Cart #${c.id.slice(0,8)}`} sub="Abandoned Session" onClick={() => handleNavigate('cart', c)} typeLabel="CART" />
                            ))}
                            {results.clients.map(c => (
                                <ResultItem key={c.id} icon={User} title={c.fullName} sub={c.email || c.phone} onClick={() => handleNavigate('client', c)} typeLabel="USER" />
                            ))}
                            {results.products.map(p => (
                                <ResultItem key={p.id} icon={Package} title={i18n.language === 'ar' ? p.nameAr : p.nameEn} sub={`ID: ${p.id.slice(0,8)}`} onClick={() => handleNavigate('product', p)} typeLabel="CATALOG" />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

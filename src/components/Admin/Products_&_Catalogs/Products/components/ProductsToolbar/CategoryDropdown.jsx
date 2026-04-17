import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import styles from './CategoryDropdown.module.css';

/**
 * CategoryDropdown — Searchable dropdown to filter products by category.
 */
const CategoryDropdown = ({
    showCatDropdown,
    setShowCatDropdown,
    catSearch,
    setCatSearch,
    catRef,
    selectedCatName,
    filteredCategories,
    categoryFilter,
    onCategoryChange,
    isAr,
    tp
}) => {
    return (
        <div className={styles.catDropdownWrapper} ref={catRef}>
            <button
                className={styles.catDropdownBtn}
                onClick={() => setShowCatDropdown(!showCatDropdown)}
            >
                <span className={styles.catDropdownText}>{selectedCatName}</span>
                <ChevronDown size={14} className={`${styles.catChevron} ${showCatDropdown ? styles.catChevronOpen : ''}`} />
            </button>

            {showCatDropdown && (
                <div className={styles.catDropdown}>
                    {/* Search input inside dropdown */}
                    <div className={styles.catSearchBox}>
                        <Search size={14} className={styles.catSearchIcon} />
                        <input
                            type="text"
                            value={catSearch}
                            onChange={(e) => setCatSearch(e.target.value)}
                            placeholder={tp('cat_search_placeholder')}
                            className={styles.catSearchInput}
                            autoFocus
                        />
                    </div>

                    {/* "All" option */}
                    <button
                        className={`${styles.catOption} ${!categoryFilter ? styles.catOptionActive : ''}`}
                        onClick={() => {
                            onCategoryChange(null);
                            setShowCatDropdown(false);
                            setCatSearch('');
                        }}
                    >
                        {tp('all_categories')}
                    </button>

                    {/* Category tree */}
                    {filteredCategories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`${styles.catOption} ${cat.isParent ? styles.catParent : styles.catChild} ${categoryFilter === cat.id ? styles.catOptionActive : ''}`}
                            onClick={() => {
                                onCategoryChange(cat.id);
                                setShowCatDropdown(false);
                                setCatSearch('');
                            }}
                        >
                            {isAr ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar)}
                            {cat.isParent && <span className={styles.catParentBadge}>{tp('cat_parent')}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;

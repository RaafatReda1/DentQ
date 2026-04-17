import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SmartSearchBox.module.css';

/**
 * SmartSearchBox — Component to handle product and category search with suggestions.
 */
const SmartSearchBox = ({
    localSearch,
    setLocalSearch,
    showSuggestions,
    setShowSuggestions,
    searchRef,
    suggestions,
    handleSuggestionClick,
    onSearchChange,
    tp
}) => {
    return (
        <div className={styles.searchBox} ref={searchRef}>
            <Search size={16} className={styles.searchIcon} />
            <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => localSearch.trim().length >= 2 && setShowSuggestions(true)}
                placeholder={tp('search_placeholder')}
                className={styles.searchInput}
            />
            {localSearch && (
                <button
                    className={styles.clearSearch}
                    onClick={() => {
                        setLocalSearch('');
                        onSearchChange('');
                        setShowSuggestions(false);
                    }}
                >
                    <X size={14} />
                </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsDropdown}>
                    <span className={styles.suggestionsLabel}>{tp('search_suggestions')}</span>
                    {suggestions.map((s) => (
                        <button
                            key={s.id}
                            className={styles.suggestionItem}
                            onClick={() => handleSuggestionClick(s)}
                        >
                            {s.image && (
                                <img src={s.image} alt="" className={styles.suggestionImg} />
                            )}
                            <div className={styles.suggestionInfo}>
                                <span className={styles.suggestionLabel}>{s.label}</span>
                                <span className={styles.suggestionSub}>{s.sublabel}</span>
                            </div>
                            {s.price && (
                                <span className={styles.suggestionPrice}>${Number(s.price).toFixed(2)}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
            {showSuggestions && localSearch.trim().length >= 2 && suggestions.length === 0 && (
                <div className={styles.suggestionsDropdown}>
                    <span className={styles.noResults}>{tp('search_no_results')}</span>
                </div>
            )}
        </div>
    );
};

export default SmartSearchBox;

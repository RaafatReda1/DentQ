import React, { useState, useRef } from "react";
import styles from "./SearchBar.module.css";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import SearchSuggestions from "./SearchSuggestions/SearchSuggestions";

/**
 * SearchBar Component
 * Integrated search input with suggestions and interactive states.
 */
const SearchBar = ({ menuIsOpened }) => {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // In progress: implement actual search redirection
      console.log("Searching for:", searchValue);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
    if (inputRef.current) inputRef.current.focus();
  };

  const wrapperClasses = styles.Searchwrapper;

  return (
    <div className={wrapperClasses}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.searchContainer}>
          <div className={styles.iconWrapper}>
            <Search size={18} className={styles.searchIcon} />
          </div>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={t("navbar.search_placeholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
      {searchValue && <SearchSuggestions searchQuery={searchValue} />}
    </div>
  );
};

export default SearchBar;

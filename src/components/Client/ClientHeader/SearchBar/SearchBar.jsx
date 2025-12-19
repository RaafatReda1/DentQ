import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { Search, X } from "lucide-react";
import menuStyles from "../MobileMenu/MobileMenu.module.css";
import { useTranslation } from "react-i18next";
import SearchSuggestions from "./SearchSuggestions/SearchSuggestions";

const SearchBar = ({ menuIsOpened }) => {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log("Searching for:", searchValue);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
  };

  return (
    <div
      className={menuIsOpened ? menuStyles.Searchwrapper : styles.Searchwrapper}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
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
              <X />
            </button>
          )}
        </div>
      </form>
      <SearchSuggestions searchQuery={searchValue} />
    </div>
  );
};

export default SearchBar;

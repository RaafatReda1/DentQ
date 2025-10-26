import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log("Searching for:", searchValue);
      // Add your search logic here
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchValue("");
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            className={styles.input}
            placeholder="Search medical products..."
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
    </div>
  );
};

export default SearchBar;

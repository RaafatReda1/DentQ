import React from "react";
import styles from "./SearchSuggestions.module.css";
function SearchSuggestions({ searchQuery }) {
  return (
    <div className={styles.suggestionsParent}>
      <ul>
        <li className={styles.searchSuggestionItem}>1 item</li>
        <li className={styles.searchSuggestionItem}>2 item</li>
        <li className={styles.searchSuggestionItem}>3 item</li>
      </ul>
    </div>
  );
}

export default SearchSuggestions;

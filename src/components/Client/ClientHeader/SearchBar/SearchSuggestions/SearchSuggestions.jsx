import React, { useContext, useEffect, useState } from "react";
import styles from "./SearchSuggestions.module.css";
import { productsContext } from "../../../../../utils/AppContexts";
import FindSearchSuggestionsFromProducts from "../../../../../utils/FindSearchSuggestionsFromProducts";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
function SearchSuggestions({ searchQuery }) {
  const [suggestionsIsOpen, setSuggestionsIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [products] = useContext(productsContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (searchQuery) {
      setSuggestionsIsOpen(true);
      setSuggestions(
        FindSearchSuggestionsFromProducts(products.productsList, searchQuery)
      );
    } else {
      setSuggestionsIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div
      className={suggestionsIsOpen ? styles.suggestionsParent : styles.hidden}
    >
      {suggestions.length > 0 ? (
        <ul>
          {suggestions.slice(0, 5).map((suggestion) => (
            <li className={styles.searchSuggestionItem} key={suggestion._id}>
              <div className={styles.iconWrapper}>
                <Search size={16} />
              </div>
              <div className={styles.suggestionContainer}>
                <span className={styles.searchSuggestionName}>
                  {i18n.language === "en"
                    ? suggestion.nameEn
                    : suggestion.nameAr}
                </span>
                <span className={styles.searchSuggestionDesc}>
                  {i18n.language === "en"
                    ? suggestion.descriptionEn
                    : suggestion.descriptionAr}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noResults}>{t("navbar.no_results")}</p>
      )}
    </div>
  );
}

export default SearchSuggestions;

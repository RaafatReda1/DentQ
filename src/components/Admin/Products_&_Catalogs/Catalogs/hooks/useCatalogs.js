import { useCatalogsLoad } from './useCatalogsLoad';
import { useCatalogsMutations } from './useCatalogsMutations';

/**
 * Orchestrator hook for managing Catalogs/Categories.
 * Combines data loading and mutation logic into a single surface.
 */
export const useCatalogs = () => {
    const { 
        categories, 
        setCategories, 
        loading, 
        error, 
        fetchCategories 
    } = useCatalogsLoad();

    const { 
        addCategory, 
        updateCategory, 
        deleteCategory, 
        toggleActiveStatus, 
        updateSortOrders 
    } = useCatalogsMutations(fetchCategories, setCategories);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleActiveStatus,
        updateSortOrders
    };
};

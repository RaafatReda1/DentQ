import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage the local UI logic for a single Catalog row.
 */
export const useCatalogRow = ({
    node,
    expandedIds,
    inlineParentId,
    level
}) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isInlineAdding = inlineParentId === node.id;
    
    // Level constraints: DentQ supports up to 3 levels (0, 1, 2)
    const canAddSub = level < 2;

    const name = i18n.language === 'ar' ? (node.name_ar || node.name_en) : (node.name_en || node.name_ar);

    return {
        tp,
        hasChildren,
        isExpanded,
        isInlineAdding,
        canAddSub,
        name
    };
};

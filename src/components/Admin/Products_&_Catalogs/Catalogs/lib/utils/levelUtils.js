/**
 * Utility to compute category nesting levels.
 */
export function computeLevel(parentId, cats) {
    if (!parentId) return 0;
    const parent = cats.find(c => c.id === parentId);
    return parent ? parent.level + 1 : 0;
}

/**
 * Utility to compute hierarchical slugs.
 */
export function computeSlug(nameEn, parentSlug = '') {
    if (!nameEn) return '';
    const base = nameEn.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    return parentSlug ? `${parentSlug}/${base}` : base;
}

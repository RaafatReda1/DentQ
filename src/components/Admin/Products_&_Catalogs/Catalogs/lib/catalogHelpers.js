/**
 * Build a nested tree structure from a flat array of categories.
 * Sorts them by `sort_order` at each node level, and aggregates product counts.
 * 
 * @param {Array} cats - Flat array of category objects from DB.
 * @returns {Array} Nested tree nodes.
 */
export function flatToTree(cats) {
    if (!cats || !cats.length) return [];
    
    // Create a map to hold node references
    const map = new Map(cats.map(c => [c.id, { ...c, children: [] }]));
    const roots = [];

    for (const node of map.values()) {
        if (node.parent_id) {
            const parent = map.get(node.parent_id);
            if (parent) {
                parent.children.push(node);
            } else {
                // If parent doesn't exist in map (orphan), push as root
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    }

    // Sort roots securely by sort_order
    const sortNodes = (nodes) => {
        nodes.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                sortNodes(node.children);
            }
        });
        return nodes;
    };

    // Recursively count total products bottom-up
    const aggregateCounts = (nodes) => {
        let sum = 0;
        for (const node of nodes) {
            let nodeTotal = node.productCount || 0;
            if (node.children && node.children.length > 0) {
                nodeTotal += aggregateCounts(node.children);
            }
            node.totalProducts = nodeTotal;
            sum += nodeTotal;
        }
        return sum;
    };

    const treeRoots = sortNodes(roots);
    aggregateCounts(treeRoots);

    return treeRoots;
}

/**
 * Automatically compute a hierarchical slug based on English name.
 * 
 * @param {string} nameEn - English name of the category
 * @param {string} [parentSlug] - Optional parent's slug 
 * @returns {string} Compiled slug (e.g., 'parent-slug/child-slug')
 */
export function computeSlug(nameEn, parentSlug = '') {
    if (!nameEn) return '';
    const base = nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return parentSlug ? `${parentSlug}/${base}` : base;
}

/**
 * Calculates level based on parent assignment.
 * 
 * @param {string|null} parentId - Parent ID
 * @param {Array} cats - Flat state array
 * @returns {number} The depth level (0 = Root, 1 = Sub, 2 = Deep)
 */
export function computeLevel(parentId, cats) {
    if (!parentId) return 0;
    const parent = cats.find(c => c.id === parentId);
    return parent ? parent.level + 1 : 0;
}

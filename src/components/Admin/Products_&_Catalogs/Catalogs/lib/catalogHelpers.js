import { sortNodes, aggregateCounts } from './utils/treeUtils';
export { computeSlug } from './utils/slugUtils';
export { computeLevel } from './utils/levelUtils';

/**
 * Build a nested tree structure from a flat array of categories.
 */
export function flatToTree(cats) {
    if (!cats || !cats.length) return [];
    
    const map = new Map(cats.map(c => [c.id, { ...c, children: [] }]));
    const roots = [];

    for (const node of map.values()) {
        if (node.parent_id && map.get(node.parent_id)) {
            map.get(node.parent_id).children.push(node);
        } else {
            roots.push(node);
        }
    }

    const treeRoots = sortNodes(roots);
    aggregateCounts(treeRoots);
    return treeRoots;
}

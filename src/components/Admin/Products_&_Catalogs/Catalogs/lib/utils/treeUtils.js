/**
 * Reusable Tree Utilities for Categories.
 */

export const sortNodes = (nodes) => {
    nodes.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
            sortNodes(node.children);
        }
    });
    return nodes;
};

export const aggregateCounts = (nodes) => {
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

export const countDescendants = (cat) => {
    let sum = cat.children?.length || 0;
    if (cat.children) {
        sum += cat.children.reduce((acc, child) => acc + countDescendants(child), 0);
    }
    return sum;
};

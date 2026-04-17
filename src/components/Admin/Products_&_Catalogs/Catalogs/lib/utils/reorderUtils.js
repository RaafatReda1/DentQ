/**
 * Logic to reorder nodes within an array and compute new sort orders.
 */
export const reorderNodes = (nodes, draggingId, droppedOnId) => {
    const nodesList = [...nodes];
    const draggedIndex = nodesList.findIndex(n => n.id === draggingId);
    const droppedIndex = nodesList.findIndex(n => n.id === droppedOnId);

    if (draggedIndex === -1 || droppedIndex === -1) return null;

    const [draggedNode] = nodesList.splice(draggedIndex, 1);
    nodesList.splice(droppedIndex, 0, draggedNode);

    return nodesList.map((node, i) => ({
        id: node.id,
        sort_order: i + 1
    }));
};

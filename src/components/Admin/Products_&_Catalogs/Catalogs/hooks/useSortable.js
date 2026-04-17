import { useState, useCallback } from 'react';

/**
 * Handle Drag and Drop tracking logic for the generic tree table rows.
 * Disconnects the mouse/drag events from the visual components.
 */
export const useSortable = (updateSortOrdersCallback) => {
    const [draggingId, setDraggingId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);

    const handleDragStart = (e, id) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Minor visual feedback
        setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
    };

    const handleDragOver = (e, id, level, draggingLevel) => {
        e.preventDefault();
        // Prevent cross-level dragging
        if (level === draggingLevel) {
            setDragOverId(id);
            e.dataTransfer.dropEffect = 'move';
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    };

    const handleDragLeave = () => {
        setDragOverId(null);
    };

    const handleDrop = async (e, droppedOnId, currentNodes) => {
        e.preventDefault();
        e.target.style.opacity = '1';
        setDragOverId(null);
        
        if (!draggingId || draggingId === droppedOnId) {
            setDraggingId(null);
            return;
        }

        const nodesList = [...currentNodes];
        const draggedIndex = nodesList.findIndex(n => n.id === draggingId);
        const droppedIndex = nodesList.findIndex(n => n.id === droppedOnId);

        if (draggedIndex === -1 || droppedIndex === -1) {
            setDraggingId(null);
            return;
        }

        // Reorder array
        const [draggedNode] = nodesList.splice(draggedIndex, 1);
        nodesList.splice(droppedIndex, 0, draggedNode);

        // Compute new sort orders
        const payload = nodesList.map((node, i) => ({
            id: node.id,
            sort_order: i + 1
        }));

        setDraggingId(null);
        
        if (updateSortOrdersCallback) {
            await updateSortOrdersCallback(payload);
        }
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggingId(null);
        setDragOverId(null);
    };

    return {
        draggingId,
        dragOverId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd
    };
};

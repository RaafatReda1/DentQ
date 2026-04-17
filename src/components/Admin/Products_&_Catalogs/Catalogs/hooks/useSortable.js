import { useState } from 'react';
import { reorderNodes } from '../lib/utils/reorderUtils';

export const useSortable = (updateSortOrdersCallback) => {
    const [draggingId, setDraggingId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);

    const handleDragStart = (e, id) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
    };

    const handleDragOver = (e, id, level, draggingLevel) => {
        e.preventDefault();
        if (level === draggingLevel) {
            setDragOverId(id);
            e.dataTransfer.dropEffect = 'move';
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    };

    const handleDrop = async (e, droppedOnId, currentNodes) => {
        e.preventDefault();
        e.target.style.opacity = '1';
        setDragOverId(null);
        if (!draggingId || draggingId === droppedOnId) return setDraggingId(null);

        const payload = reorderNodes(currentNodes, draggingId, droppedOnId);
        setDraggingId(null);
        if (payload && updateSortOrdersCallback) await updateSortOrdersCallback(payload);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggingId(null);
        setDragOverId(null);
    };

    return { 
        draggingId, dragOverId, handleDragStart, handleDragOver, 
        handleDragLeave: () => setDragOverId(null), handleDrop, handleDragEnd 
    };
};

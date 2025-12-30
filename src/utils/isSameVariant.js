/**
 * Helper to compare two product variants to see if they are the same.
 * Normalizes null/undefined values for color and size.
 */
export const isSameVariant = (itemA, itemB) => {
    if (!itemA || !itemB) return false;

    // Normalize comparison to handle undefined/null inconsistencies
    const idA = String(itemA.id);
    const idB = String(itemB.id);
    const colorA = itemA.color || null;
    const colorB = itemB.color || null;
    const sizeA = itemA.size || null;
    const sizeB = itemB.size || null;

    return idA === idB && colorA === colorB && sizeA === sizeB;
};

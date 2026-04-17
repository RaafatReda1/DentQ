import { useState } from 'react';

/**
 * Custom hook isolating the tag & color addition logic from the UI.
 * Handles validation, duplicates, and callback execution.
 *
 * @param {Array} tags - Array of primitive strings OR array of color objects.
 * @param {Function} onChange - Update callback for parent form.
 * @param {boolean} isColor - Are we processing colors or regular sizes?
 * @returns {Object} Handles and variable states for the UI.
 */
export const useTagInput = (tags, onChange, isColor) => {
    const [inputValue, setInputValue] = useState('');
    const [colorValue, setColorValue] = useState('rgb(59, 199, 246)');

    const handleAddTag = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        if (isColor) {
            // Dodge duplicate color names
            if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return;
            onChange([...tags, { name: trimmed, hex: colorValue }]);
        } else {
            // Dodge duplicate sizes
            if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
            onChange([...tags, trimmed]);
        }

        setInputValue('');
    };

    const handleRemoveTag = (index) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return {
        inputValue, setInputValue,
        colorValue, setColorValue,
        handleAddTag, handleRemoveTag, handleKeyDown
    };
};

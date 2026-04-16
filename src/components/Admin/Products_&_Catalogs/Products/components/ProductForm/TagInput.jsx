import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import styles from './TagInput.module.css';

/**
 * TagInput — Reusable chip/tag input for sizes and colors.
 * 
 * Props:
 *   - tags (array) — current tags, e.g. ["S","M","L"] or [{name:"Red",hex:"#ff0000"}]
 *   - onChange(newTags) callback
 *   - placeholder (string)
 *   - isColor (bool) — if true, shows color picker alongside name
 *   - label (string) — section label
 */
const TagInput = ({ tags = [], onChange, placeholder = 'Add tag...', isColor = false, label }) => {
    const [inputValue, setInputValue] = useState('');
    const [colorValue, setColorValue] = useState('#3b82f6');

    const handleAddTag = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        let newTag;
        if (isColor) {
            // Check if color name already exists
            if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return;
            newTag = { name: trimmed, hex: colorValue };
            onChange([...tags, newTag]);
        } else {
            // Check if tag already exists
            if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
            onChange([...tags, trimmed]);
        }

        setInputValue('');
    };

    const handleRemoveTag = (index) => {
        const updated = tags.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className={styles.tagInput}>
            {label && <label className={styles.label}>{label}</label>}

            <div className={styles.tagsContainer}>
                {/* Render existing tags */}
                {tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                        {isColor && (
                            <span
                                className={styles.colorDot}
                                style={{ backgroundColor: tag.hex }}
                            />
                        )}
                        <span>{isColor ? tag.name : tag}</span>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => handleRemoveTag(index)}
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                {/* Input area */}
                <div className={styles.inputWrapper}>
                    {isColor && (
                        <input
                            type="color"
                            value={colorValue}
                            onChange={(e) => setColorValue(e.target.value)}
                            className={styles.colorPicker}
                            title="Pick a color"
                        />
                    )}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={handleAddTag}
                        disabled={!inputValue.trim()}
                    >
                        <Plus size={14} />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagInput;

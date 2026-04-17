import React from 'react';
import { X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTagInput } from './useTagInput';
import styles from './TagInput.module.css';

/**
 * TagInput UI
 * Extremely lightweight chip renderer relying on `useTagInput` for array modification logic.
 */
const TagInput = ({ tags = [], onChange, placeholder, isColor = false, label }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);

    const {
        inputValue, setInputValue,
        colorValue, setColorValue,
        handleAddTag, handleRemoveTag, handleKeyDown
    } = useTagInput(tags, onChange, isColor);

    return (
        <div className={styles.tagInput}>
            {label && <label className={styles.label}>{label}</label>}

            <div className={styles.tagsContainer}>
                {/* Applied Tags Render */}
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

                {/* Input mechanism */}
                <div className={styles.inputWrapper}>
                    {isColor && (
                        <input
                            type="color"
                            value={colorValue}
                            onChange={(e) => setColorValue(e.target.value)}
                            className={styles.colorPicker}
                            title={tp('form_pick_color')}
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
                        <span>{tp('form_add_btn')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagInput;

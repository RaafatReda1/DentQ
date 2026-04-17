import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useImageUpload } from './useImageUpload';
import styles from './ImageUploader.module.css';

/**
 * ImageUploader UI
 * Drag-and-drop boundary visualizer. Supabase state logic handles through `useImageUpload`.
 */
const ImageUploader = ({ images = [], onChange, maxFiles = 10, productId }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const fileInputRef = useRef(null);

    // Business logic decoupled from rendering
    const {
        isDragging, setIsDragging,
        uploading,
        urlInput, setUrlInput,
        handleDrop, handleRemove, handleAddUrl,
        uploadToSupabase
    } = useImageUpload(images, onChange, maxFiles, productId);

    return (
        <div className={styles.uploader}>
            {/* Drag & Drop Boundary */}
            <div
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${uploading ? styles.uploading : ''}`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <Upload size={24} className={styles.uploadIcon} />
                {uploading ? (
                    <>
                        <div className={styles.uploadSpinner}></div>
                        <p className={styles.dropText}>{tp('form_uploading')}</p>
                    </>
                ) : (
                    <>
                        <p className={styles.dropText}>{tp('form_drop_images')}</p>
                        <p className={styles.dropHint}>{tp('form_image_hint')}</p>
                    </>
                )}
                
                {/* Invisible input overlay */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={(e) => uploadToSupabase(e.target.files)}
                    className={styles.hiddenInput}
                    disabled={uploading}
                />
            </div>

            {/* URL Fallback Bar */}
            <div className={styles.urlRow}>
                <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                    placeholder={tp('form_paste_url')}
                    className={styles.urlInput}
                />
                <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim()}
                    className={styles.urlBtn}
                >
                    {tp('form_add_btn')}
                </button>
            </div>

            {/* Rendered Preview Deck */}
            {images.length > 0 && (
                <div className={styles.previews}>
                    {images.map((url, index) => (
                        <div key={index} className={styles.thumb}>
                            <img 
                                src={url} 
                                alt={`Product ${index + 1}`} 
                                className={styles.thumbImg} 
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.net/200.png'; }}
                            />
                            <button
                                type="button"
                                className={styles.thumbRemove}
                                onClick={() => handleRemove(index)}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p className={styles.countHint}>
                {images.length}/{maxFiles} {tp('form_images_label')}
            </p>
        </div>
    );
};

export default ImageUploader;

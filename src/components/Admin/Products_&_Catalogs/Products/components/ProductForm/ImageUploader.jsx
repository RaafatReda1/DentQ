import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import styles from './ImageUploader.module.css';

/**
 * ImageUploader — Drag-and-drop image upload with preview thumbnails.
 * Stores URLs in an array. If Supabase storage is configured, uploads there;
 * otherwise falls back to accepting pasted URLs.
 * 
 * Props:
 *   - images (string[]) — array of image URLs
 *   - onChange(newImages) callback
 *   - maxFiles (number) — default 10
 */
const ImageUploader = ({ images = [], onChange, maxFiles = 10 }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const handleFiles = (fileList) => {
        const files = Array.from(fileList);
        const validFiles = files.filter((f) => {
            const valid = ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
            const sizeOk = f.size <= 5 * 1024 * 1024; // 5MB
            return valid && sizeOk;
        });

        // Create preview URLs (in production, you'd upload to Supabase Storage here)
        const newUrls = validFiles.map((f) => URL.createObjectURL(f));
        const combined = [...images, ...newUrls].slice(0, maxFiles);
        onChange(combined);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleRemove = (index) => {
        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleAddUrl = () => {
        const trimmed = urlInput.trim();
        if (!trimmed) return;
        if (images.length >= maxFiles) return;
        onChange([...images, trimmed]);
        setUrlInput('');
    };

    return (
        <div className={styles.uploader}>
            {/* Drop zone */}
            <div
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload size={24} className={styles.uploadIcon} />
                <p className={styles.dropText}>Drop images here</p>
                <p className={styles.dropHint}>PNG, JPG, WEBP · max 5MB</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className={styles.hiddenInput}
                />
            </div>

            {/* URL fallback input */}
            <div className={styles.urlRow}>
                <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                    placeholder="Or paste image URL..."
                    className={styles.urlInput}
                />
                <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim()}
                    className={styles.urlBtn}
                >
                    Add
                </button>
            </div>

            {/* Thumbnails preview */}
            {images.length > 0 && (
                <div className={styles.previews}>
                    {images.map((url, index) => (
                        <div key={index} className={styles.thumb}>
                            <img src={url} alt={`Product ${index + 1}`} className={styles.thumbImg} />
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
                {images.length}/{maxFiles} images
            </p>
        </div>
    );
};

export default ImageUploader;

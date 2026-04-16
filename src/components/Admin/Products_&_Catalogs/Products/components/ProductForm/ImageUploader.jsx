import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../../../../utils/SupabaseClient';
import styles from './ImageUploader.module.css';

/**
 * ImageUploader — Drag-and-drop image upload to Supabase "Products" bucket.
 * Organizes files as: Products/<productId-or-temp>/<timestamp>_<filename>
 * 
 * Props:
 *   - images (string[]) — array of public URLs
 *   - onChange(newImages) callback
 *   - maxFiles (number) — default 10
 *   - productId (string|null) — used to organize folder structure
 */
const ImageUploader = ({ images = [], onChange, maxFiles = 10, productId }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [uploading, setUploading] = useState(false);

    /**
     * Upload files to Supabase Storage → "Products" bucket
     * Path: Products/<folder>/<timestamp>_<sanitizedName>
     */
    const uploadToSupabase = async (fileList) => {
        const files = Array.from(fileList).filter((f) => {
            const valid = ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
            const sizeOk = f.size <= 5 * 1024 * 1024; // 5MB
            return valid && sizeOk;
        });

        if (files.length === 0) return;
        setUploading(true);

        const folder = productId || `temp_${Date.now()}`;
        const newUrls = [];

        for (const file of files) {
            if (images.length + newUrls.length >= maxFiles) break;

            // Sanitize filename: remove special chars, keep extension
            const ext = file.name.split('.').pop();
            const baseName = file.name
                .replace(/\.[^.]+$/, '')
                .replace(/[^a-zA-Z0-9_-]/g, '_')
                .substring(0, 40);
            const timestamp = Date.now();
            const filePath = `${folder}/${timestamp}_${baseName}.${ext}`;

            const { error } = await supabase.storage
                .from('Products')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.error('Upload error:', error.message);
                continue;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('Products')
                .getPublicUrl(filePath);

            if (urlData?.publicUrl) {
                newUrls.push(urlData.publicUrl);
            }
        }

        if (newUrls.length > 0) {
            onChange([...images, ...newUrls].slice(0, maxFiles));
        }

        setUploading(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) {
            uploadToSupabase(e.dataTransfer.files);
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
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${uploading ? styles.uploading : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <Upload size={24} className={styles.uploadIcon} />
                {uploading ? (
                    <>
                        <div className={styles.uploadSpinner}></div>
                        <p className={styles.dropText}>Uploading...</p>
                    </>
                ) : (
                    <>
                        <p className={styles.dropText}>{tp('form_drop_images')}</p>
                        <p className={styles.dropHint}>{tp('form_image_hint')}</p>
                    </>
                )}
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

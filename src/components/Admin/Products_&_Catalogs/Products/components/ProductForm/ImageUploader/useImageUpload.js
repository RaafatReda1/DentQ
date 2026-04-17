import { useState } from 'react';
import { supabase } from '../../../../../../../utils/SupabaseClient';

/**
 * Custom hook to manage the state and upload processes of images.
 * Extracts Supabase interaction logic out of the visual ImageUploader component.
 *
 * @param {string[]} images - The current array of image URLs.
 * @param {Function} onChange - Callback to update the parent state.
 * @param {number} maxFiles - Maximum allowed files.
 * @param {string|null} productId - The ID used for folder structuring inside Supabase.
 * @returns {Object} { isDragging, uploading, urlInput, setUrlInput, setIsDragging, handleDrop, handleRemove, handleAddUrl, uploadToSupabase }
 */
export const useImageUpload = (images, onChange, maxFiles, productId) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    /**
     * Uploads dropped/selected files silently to Supabase.
     */
    const uploadToSupabase = async (fileList) => {
        const files = Array.from(fileList).filter((f) => {
            const valid = ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
            const sizeOk = f.size <= 5 * 1024 * 1024; // 5MB limit
            return valid && sizeOk;
        });

        if (files.length === 0) return;
        setUploading(true);

        const folder = productId || `temp_${Date.now()}`;
        const newUrls = [];

        for (const file of files) {
            if (images.length + newUrls.length >= maxFiles) break;

            const ext = file.name.split('.').pop();
            const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
            const timestamp = Date.now();
            const filePath = `${folder}/${timestamp}_${baseName}.${ext}`;

            const { error } = await supabase.storage.from('Products').upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

            if (error) {
                console.error('Upload error:', error.message);
                continue;
            }

            const { data: urlData } = supabase.storage.from('Products').getPublicUrl(filePath);
            if (urlData?.publicUrl) {
                newUrls.push(urlData.publicUrl);
            }
        }

        if (newUrls.length > 0) {
            onChange([...images, ...newUrls].slice(0, maxFiles));
        }

        setUploading(false);
    };

    /** Drag Handlers */
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) uploadToSupabase(e.dataTransfer.files);
    };

    /** Remove by array index */
    const handleRemove = (index) => {
        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
    };

    /** Add standard external URL fallback */
    const handleAddUrl = () => {
        const trimmed = urlInput.trim();
        if (!trimmed || images.length >= maxFiles) return;
        onChange([...images, trimmed]);
        setUrlInput('');
    };

    return {
        isDragging, setIsDragging,
        uploading,
        urlInput, setUrlInput,
        handleDrop, handleRemove, handleAddUrl,
        uploadToSupabase
    };
};

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import TagInput from './TagInput';
import ImageUploader from './ImageUploader';
import styles from './ProductForm.module.css';

/**
 * ProductForm — Full Add/Edit product form with bilingual fields, pricing, tags, images.
 * Two save modes: "Save as draft" (is_active: false) and "Publish" (is_active: true).
 * 
 * Props:
 *   - isOpen (bool)
 *   - product (object | null) — null = add mode, object = edit mode
 *   - categories[] — for category dropdown
 *   - onSave(productData, isDraft) callback
 *   - onClose() callback
 *   - loading (bool) — shows spinner on save button
 */
const INITIAL_FORM = {
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    fullDescriptionEn: '',
    fullDescriptionAr: '',
    price: '',
    original_price: '',
    discount: '',
    profit: '',
    stock: '',
    category_id: '',
    sizes: [],
    colors: [],
    images: [],
    videoUrl: '',
    is_active: true,
    is_featured: false,
    is_trending: false,
};

const ProductForm = ({ isOpen, product, categories = [], onSave, onClose, loading }) => {
    const [form, setForm] = useState(INITIAL_FORM);
    const isEditing = !!product;

    // Pre-fill form when editing
    useEffect(() => {
        if (product) {
            setForm({
                nameEn: product.nameEn || '',
                nameAr: product.nameAr || '',
                descriptionEn: product.descriptionEn || '',
                descriptionAr: product.descriptionAr || '',
                fullDescriptionEn: product.fullDescriptionEn || '',
                fullDescriptionAr: product.fullDescriptionAr || '',
                price: product.price || '',
                original_price: product.original_price || '',
                discount: product.discount || '',
                profit: product.profit || '',
                stock: product.stock ?? '',
                category_id: product.category_id || '',
                sizes: product.sizes || [],
                colors: product.colors || [],
                images: product.images || [],
                videoUrl: product.videoUrl || '',
                is_active: product.is_active ?? true,
                is_featured: product.is_featured ?? false,
                is_trending: product.is_trending ?? false,
            });
        } else {
            setForm(INITIAL_FORM);
        }
    }, [product]);

    if (!isOpen) return null;

    const updateField = (field, value) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value };

            // Auto-calculate discount when price and original_price change
            if ((field === 'price' || field === 'original_price') && updated.price && updated.original_price) {
                const p = Number(updated.price);
                const op = Number(updated.original_price);
                if (op > p && op > 0) {
                    updated.discount = ((1 - p / op) * 100).toFixed(0);
                }
            }

            return updated;
        });
    };

    const handleSubmit = (isDraft) => {
        // Build the data object matching DB schema
        const data = {
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim() || null,
            descriptionEn: form.descriptionEn.trim() || null,
            descriptionAr: form.descriptionAr.trim() || null,
            fullDescriptionEn: form.fullDescriptionEn.trim() || null,
            fullDescriptionAr: form.fullDescriptionAr.trim() || null,
            price: Number(form.price),
            original_price: form.original_price ? Number(form.original_price) : null,
            discount: form.discount ? Number(form.discount) : null,
            profit: form.profit ? Number(form.profit) : null,
            stock: form.stock !== '' ? Number(form.stock) : 0,
            category_id: form.category_id || null,
            sizes: form.sizes.length > 0 ? form.sizes : null,
            colors: form.colors.length > 0 ? form.colors : null,
            images: form.images,
            videoUrl: form.videoUrl.trim() || null,
            is_active: isDraft ? false : form.is_active,
            is_featured: form.is_featured,
            is_trending: form.is_trending,
        };

        onSave(data, isDraft);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.formHeader}>
                    <div>
                        <h2 className={styles.formTitle}>
                            {isEditing ? 'Edit product' : 'Add new product'}
                        </h2>
                        <p className={styles.formSubtitle}>All fields marked * are required</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.draftBtn}
                            onClick={() => handleSubmit(true)}
                            disabled={loading || !form.nameEn.trim() || !form.price}
                        >
                            {isEditing ? 'Save as draft' : 'Save as draft'}
                        </button>
                        <button
                            className={styles.publishBtn}
                            onClick={() => handleSubmit(false)}
                            disabled={loading || !form.nameEn.trim() || !form.price}
                        >
                            {loading ? 'Saving...' : isEditing ? 'Update product' : 'Publish product'}
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Two-column layout */}
                <div className={styles.formBody}>
                    {/* ─── Left Column: Main fields ─── */}
                    <div className={styles.mainColumn}>
                        {/* Basic Info */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>BASIC INFO</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name (English) *</label>
                                <input
                                    type="text"
                                    value={form.nameEn}
                                    onChange={(e) => updateField('nameEn', e.target.value)}
                                    placeholder="e.g. Wireless Earbuds Pro"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name (Arabic)</label>
                                <input
                                    type="text"
                                    value={form.nameAr}
                                    onChange={(e) => updateField('nameAr', e.target.value)}
                                    placeholder="اسم المنتج بالعربي"
                                    className={styles.input}
                                    dir="rtl"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Short description (EN)</label>
                                <textarea
                                    value={form.descriptionEn}
                                    onChange={(e) => updateField('descriptionEn', e.target.value)}
                                    placeholder="Brief product description..."
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Short description (AR)</label>
                                <textarea
                                    value={form.descriptionAr}
                                    onChange={(e) => updateField('descriptionAr', e.target.value)}
                                    placeholder="وصف المنتج..."
                                    className={styles.textarea}
                                    dir="rtl"
                                    rows={3}
                                />
                            </div>
                        </section>

                        {/* Pricing & Inventory */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>PRICING & INVENTORY</h3>

                            <div className={styles.row3}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Price * / Original price / Discount %</label>
                                    <div className={styles.priceRow}>
                                        <input
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => updateField('price', e.target.value)}
                                            placeholder="$0.00"
                                            className={styles.input}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                        <input
                                            type="number"
                                            value={form.original_price}
                                            onChange={(e) => updateField('original_price', e.target.value)}
                                            placeholder="$0.00"
                                            className={styles.input}
                                            step="0.01"
                                            min="0"
                                        />
                                        <input
                                            type="number"
                                            value={form.discount}
                                            onChange={(e) => updateField('discount', e.target.value)}
                                            placeholder="0%"
                                            className={styles.input}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Profit (auto-calculated or manual)</label>
                                <input
                                    type="number"
                                    value={form.profit}
                                    onChange={(e) => updateField('profit', e.target.value)}
                                    placeholder="Calculated from price − cost"
                                    className={styles.input}
                                    step="0.01"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Stock quantity *</label>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => updateField('stock', e.target.value)}
                                    placeholder="0"
                                    className={styles.input}
                                    min="0"
                                    required
                                />
                            </div>
                        </section>

                        {/* Organization */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>ORGANIZATION</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Category *</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => updateField('category_id', e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name_en || cat.name_ar}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <TagInput
                                label="Sizes (JSON tags)"
                                tags={form.sizes}
                                onChange={(tags) => updateField('sizes', tags)}
                                placeholder="+ Add size"
                            />

                            <TagInput
                                label="Colors (JSON tags)"
                                tags={form.colors}
                                onChange={(tags) => updateField('colors', tags)}
                                placeholder="+ Add color"
                                isColor
                            />
                        </section>
                    </div>

                    {/* ─── Right Column: Media, Flags, Full Description ─── */}
                    <div className={styles.sideColumn}>
                        {/* Media */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>MEDIA</h3>
                            <ImageUploader
                                images={form.images}
                                onChange={(imgs) => updateField('images', imgs)}
                            />
                            <p className={styles.hint}>
                                Images stored as array in Products.images[]
                            </p>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Video URL</label>
                                <input
                                    type="url"
                                    value={form.videoUrl}
                                    onChange={(e) => updateField('videoUrl', e.target.value)}
                                    placeholder="https://..."
                                    className={styles.input}
                                />
                            </div>
                        </section>

                        {/* Flags */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>FLAGS</h3>
                            <div className={styles.flagsList}>
                                {[
                                    { field: 'is_active', label: 'is_active' },
                                    { field: 'is_featured', label: 'is_featured' },
                                    { field: 'is_trending', label: 'is_trending' },
                                ].map(({ field, label }) => (
                                    <div key={field} className={styles.flagRow}>
                                        <span className={styles.flagLabel}>{label}</span>
                                        <label className={styles.toggleSwitch}>
                                            <input
                                                type="checkbox"
                                                checked={form[field]}
                                                onChange={(e) => updateField(field, e.target.checked)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <p className={styles.flagsHint}>
                                New products start as <strong style={{ color: '#22c55e' }}>Active</strong> by default.
                                Toggle <strong>is_featured</strong> to show on homepage hero.
                            </p>
                        </section>

                        {/* Full Description */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>FULL DESCRIPTION</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full desc. (EN)</label>
                                <textarea
                                    value={form.fullDescriptionEn}
                                    onChange={(e) => updateField('fullDescriptionEn', e.target.value)}
                                    placeholder="Detailed product copy..."
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full desc. (AR)</label>
                                <textarea
                                    value={form.fullDescriptionAr}
                                    onChange={(e) => updateField('fullDescriptionAr', e.target.value)}
                                    placeholder="وصف تفصيلي..."
                                    className={styles.textarea}
                                    dir="rtl"
                                    rows={4}
                                />
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.formFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button
                        className={styles.draftBtn}
                        onClick={() => handleSubmit(true)}
                        disabled={loading || !form.nameEn.trim() || !form.price}
                    >
                        Save as draft
                    </button>
                    <button
                        className={styles.publishBtn}
                        onClick={() => handleSubmit(false)}
                        disabled={loading || !form.nameEn.trim() || !form.price}
                    >
                        {loading ? 'Saving...' : isEditing ? 'Update product' : 'Publish product'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TagInput from './TagInput';
import ImageUploader from './ImageUploader';
import styles from './ProductForm.module.css';

/**
 * ProductForm — Full Add/Edit product form with bilingual fields, pricing, tags, images.
 * Two save modes: "Save as draft" and "Publish".
 * Fully localized with i18n.
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
    cost: '',
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
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const isEditing = !!product;
    const [form, setForm] = useState(INITIAL_FORM);

    const currentLang = i18n.language;

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
                cost: product.cost || '',
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
    }, [product, isOpen]);

    if (!isOpen) return null;

    const updateField = (field, value) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value };

            // Auto-calculate Price and Profit
            const op = Number(updated.original_price || 0);
            const disc = Number(updated.discount || 0);
            const c = Number(updated.cost || 0);

            if (op > 0) {
                // Sale Price = Original - (Original * Discount%)
                const salePrice = op - (op * (disc / 100));
                updated.price = salePrice.toFixed(2);

                // Profit = Sale Price - Cost
                updated.profit = (salePrice - c).toFixed(2);
            } else {
                updated.price = '';
                updated.profit = '';
            }

            return updated;
        });
    };

    const handleSubmit = (isDraft) => {
        const data = {
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim() || null,
            descriptionEn: form.descriptionEn.trim() || null,
            descriptionAr: form.descriptionAr.trim() || null,
            fullDescriptionEn: form.fullDescriptionEn.trim() || null,
            fullDescriptionAr: form.fullDescriptionAr.trim() || null,
            price: Number(form.price) || 0,
            original_price: form.original_price ? Number(form.original_price) : null,
            discount: form.discount ? Number(form.discount) : null,
            cost: form.cost ? Number(form.cost) : null,
            profit: form.profit ? Number(form.profit) : 0,
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

        onSave(data, !isDraft && !isEditing ? false : isDraft);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.formHeader}>
                    <div>
                        <h2 className={styles.formTitle}>
                            {isEditing ? tp('form_edit_title') : tp('form_add_title')}
                        </h2>
                        <p className={styles.formSubtitle}>{tp('form_required')}</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.draftBtn}
                            onClick={() => handleSubmit(true)}
                            disabled={loading || !form.nameEn.trim() || !form.price}
                        >
                            {tp('form_save_draft')}
                        </button>
                        <button
                            className={styles.publishBtn}
                            onClick={() => handleSubmit(false)}
                            disabled={loading || !form.nameEn.trim() || !form.price}
                        >
                            {loading ? tp('form_saving') : isEditing ? tp('form_update') : tp('form_publish')}
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.formBody}>
                    <div className={styles.mainColumn}>
                        {/* Basic Info */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>{tp('form_basic_info')}</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_name_en')}</label>
                                <input
                                    type="text"
                                    value={form.nameEn}
                                    onChange={(e) => updateField('nameEn', e.target.value)}
                                    placeholder={tp('form_name_en_placeholder')}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_name_ar')}</label>
                                <input
                                    type="text"
                                    value={form.nameAr}
                                    onChange={(e) => updateField('nameAr', e.target.value)}
                                    placeholder={tp('form_name_ar_placeholder')}
                                    className={styles.input}
                                    dir="rtl"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_desc_en')}</label>
                                <textarea
                                    value={form.descriptionEn}
                                    onChange={(e) => updateField('descriptionEn', e.target.value)}
                                    placeholder={tp('form_desc_en_placeholder')}
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_desc_ar')}</label>
                                <textarea
                                    value={form.descriptionAr}
                                    onChange={(e) => updateField('descriptionAr', e.target.value)}
                                    placeholder={tp('form_desc_ar_placeholder')}
                                    className={styles.textarea}
                                    dir="rtl"
                                    rows={3}
                                />
                            </div>
                        </section>

                        {/* Pricing & Inventory */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>{tp('form_pricing')}</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_price_label')}</label>
                                <div className={styles.priceRow}>
                                    <div className={styles.formInsideGroup}>
                                        <small className={styles.inputHint}>{tp('form_cost')}</small>
                                        <input
                                            type="number"
                                            value={form.cost}
                                            onChange={(e) => updateField('cost', e.target.value)}
                                            placeholder="$0.00"
                                            className={styles.input}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formInsideGroup}>
                                        <small className={styles.inputHint}>{tp('admin.products.col_price')} (Sale)</small>
                                        <input
                                            type="text"
                                            value={form.price}
                                            readOnly
                                            className={`${styles.input} ${styles.readOnlyInput}`}
                                            placeholder="$0.00"
                                        />
                                    </div>
                                    <div className={styles.formInsideGroup}>
                                        <small className={styles.inputHint}>Orig. Price *</small>
                                        <input
                                            type="number"
                                            value={form.original_price}
                                            onChange={(e) => updateField('original_price', e.target.value)}
                                            placeholder="$0.00"
                                            className={styles.input}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formInsideGroup}>
                                        <small className={styles.inputHint}>Disc. %</small>
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
                                <label className={styles.label}>{tp('form_profit')}</label>
                                <input
                                    type="text"
                                    value={form.profit}
                                    readOnly
                                    className={`${styles.input} ${styles.readOnlyInput} ${Number(form.profit) < 0 ? styles.lossValue : ''}`}
                                    placeholder={tp('form_profit_placeholder')}
                                />
                            </div>v>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_stock')}</label>
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
                            <h3 className={styles.sectionTitle}>{tp('form_organization')}</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_category')}</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => updateField('category_id', e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">{tp('form_select_category')}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {currentLang === 'ar' ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <TagInput
                                label={tp('form_sizes')}
                                tags={form.sizes}
                                onChange={(tags) => updateField('sizes', tags)}
                                placeholder={tp('form_add_size')}
                            />

                            <TagInput
                                label={tp('form_colors')}
                                tags={form.colors}
                                onChange={(tags) => updateField('colors', tags)}
                                placeholder={tp('form_add_color')}
                                isColor
                            />
                        </section>
                    </div>

                    <div className={styles.sideColumn}>
                        {/* Media */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>{tp('form_media')}</h3>
                            <ImageUploader
                                images={form.images}
                                onChange={(imgs) => updateField('images', imgs)}
                                productId={product?.id}
                            />
                            <p className={styles.hint}>{tp('form_images_stored')}</p>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_video_url')}</label>
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
                            <h3 className={styles.sectionTitle}>{tp('form_flags')}</h3>
                            <div className={styles.flagsList}>
                                {[
                                    { field: 'is_active', label: tp('toggle_active') },
                                    { field: 'is_featured', label: tp('toggle_featured') },
                                    { field: 'is_trending', label: tp('toggle_trending') },
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
                            <p className={styles.flagsHint}>{tp('form_flags_hint')}</p>
                        </section>

                        {/* Full Description */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>{tp('form_full_desc')}</h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_full_desc_en')}</label>
                                <textarea
                                    value={form.fullDescriptionEn}
                                    onChange={(e) => updateField('fullDescriptionEn', e.target.value)}
                                    placeholder={tp('form_full_desc_en_placeholder')}
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{tp('form_full_desc_ar')}</label>
                                <textarea
                                    value={form.fullDescriptionAr}
                                    onChange={(e) => updateField('fullDescriptionAr', e.target.value)}
                                    placeholder={tp('form_full_desc_ar_placeholder')}
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
                    <button className={styles.cancelBtn} onClick={onClose}>{tp('cancel')}</button>
                    <button
                        className={styles.draftBtn}
                        onClick={() => handleSubmit(true)}
                        disabled={loading || !form.nameEn.trim() || !form.price}
                    >
                        {tp('form_save_draft')}
                    </button>
                    <button
                        className={styles.publishBtn}
                        onClick={() => handleSubmit(false)}
                        disabled={loading || !form.nameEn.trim() || !form.original_price || !form.cost}
                    >
                        {loading ? tp('form_saving') : isEditing ? tp('form_update') : tp('form_publish')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;

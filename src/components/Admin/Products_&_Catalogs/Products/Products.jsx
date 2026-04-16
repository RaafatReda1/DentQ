import React, { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

// Services
import { fetchProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } from '../../../../services/productsService';
import { fetchCategories } from '../../../../services/categoriesService';

// Sub-components
import ProductsToolbar from './components/ProductsToolbar/ProductsToolbar';
import StatBar from './components/StatBar/StatBar';
import TableView from './components/TableView/TableView';
import GridView from './components/GridView/GridView';
import DetailView from './components/DetailView/DetailView';
import ProductForm from './components/ProductForm/ProductForm';
import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';

import styles from './Products.module.css';

/**
 * Products — Main orchestrator component.
 * Manages all shared state (data, filters, pagination, view mode)
 * and passes it into the active view.
 * 
 * All 3 views share the same data/filter state — switching views
 * never resets a search or filter in progress.
 */
const PAGE_SIZE = 20;

const getInitialView = () => {
    // Mobile fallback → force detail view
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 'detail';
    return localStorage.getItem('adminProductView') || 'table';
};

const Products = () => {
    // ─── Data state ───
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // ─── Filter / Search / Sort state ───
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // ─── Pagination ───
    const [currentPage, setCurrentPage] = useState(0);

    // ─── View mode (persisted in localStorage) ───
    const [activeView, setActiveView] = useState(getInitialView);

    // ─── Selection state (for table checkboxes / bulk actions) ───
    const [selectedIds, setSelectedIds] = useState([]);

    // ─── Detail view: selected product ───
    const [selectedProduct, setSelectedProduct] = useState(null);

    // ─── Form state ───
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // ─── Delete modal state ───
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ─── All products for stats (separate fetch without pagination for stats) ───
    const [allProducts, setAllProducts] = useState([]);

    // ────────────────────────────────────────────────
    // DATA FETCHING
    // ────────────────────────────────────────────────

    // Fetch categories once
    useEffect(() => {
        const loadCategories = async () => {
            const { data } = await fetchCategories();
            if (data) setCategories(data);
        };
        loadCategories();
    }, []);

    // Fetch products when filters/page change
    const loadProducts = useCallback(async () => {
        setLoading(true);
        const { data, count, error } = await fetchProducts({
            page: currentPage,
            limit: PAGE_SIZE,
            searchTerm: searchTerm,
            categoryId: categoryFilter,
        });

        if (error) {
            toast.error('Failed to load products');
            setLoading(false);
            return;
        }

        let filtered = data || [];

        // Client-side status filtering (since the service doesn't support it)
        if (statusFilter === 'active') filtered = filtered.filter((p) => p.is_active && !p.is_featured && !p.is_trending);
        else if (statusFilter === 'inactive') filtered = filtered.filter((p) => !p.is_active);
        else if (statusFilter === 'featured') filtered = filtered.filter((p) => p.is_featured);
        else if (statusFilter === 'trending') filtered = filtered.filter((p) => p.is_trending);
        else if (statusFilter === 'low_stock') filtered = filtered.filter((p) => p.stock <= 10);

        // Client-side sorting
        if (sortBy === 'price_asc') filtered.sort((a, b) => Number(a.price) - Number(b.price));
        else if (sortBy === 'price_desc') filtered.sort((a, b) => Number(b.price) - Number(a.price));
        else if (sortBy === 'name_asc') filtered.sort((a, b) => (a.nameEn || '').localeCompare(b.nameEn || ''));
        // 'newest' is already sorted by the service

        setProducts(filtered);
        setTotalCount(count || 0);

        // For stats, store unfiltered data
        if (statusFilter === 'all' && !searchTerm && !categoryFilter) {
            setAllProducts(data || []);
        }

        // Auto-select first product in detail view
        if (filtered.length > 0 && !selectedProduct) {
            setSelectedProduct(filtered[0]);
        }

        setLoading(false);
    }, [currentPage, searchTerm, categoryFilter, statusFilter, sortBy]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Also fetch all products for accurate stats
    useEffect(() => {
        const loadAllForStats = async () => {
            const { data } = await fetchProducts({ page: 0, limit: 1000 });
            if (data) setAllProducts(data);
        };
        loadAllForStats();
    }, []);

    // ────────────────────────────────────────────────
    // COMPUTED STATS (derived from allProducts)
    // ────────────────────────────────────────────────

    const stats = useMemo(() => {
        const total = allProducts.length;
        const active = allProducts.filter((p) => p.is_active).length;
        const lowStock = allProducts.filter((p) => p.stock <= 10).length;
        const featured = allProducts.filter((p) => p.is_featured).length;
        const ratings = allProducts.filter((p) => p.rating).map((p) => Number(p.rating));
        const avgRating = ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : '0.0';

        return { total, active, lowStock, featured, avgRating };
    }, [allProducts]);

    // ────────────────────────────────────────────────
    // VIEW MANAGEMENT
    // ────────────────────────────────────────────────

    const handleViewChange = (view) => {
        setActiveView(view);
        localStorage.setItem('adminProductView', view);
    };

    // ────────────────────────────────────────────────
    // SELECTION (for table checkboxes)
    // ────────────────────────────────────────────────

    const handleSelectId = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (products.every((p) => selectedIds.includes(p.id))) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map((p) => p.id));
        }
    };

    // ────────────────────────────────────────────────
    // FILTER HANDLERS
    // ────────────────────────────────────────────────

    const handleStatClick = (filterKey) => {
        setStatusFilter(filterKey);
        setCurrentPage(0);
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        setCurrentPage(0);
    };

    const handleCategoryChange = (catId) => {
        setCategoryFilter(catId);
        setCurrentPage(0);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
    };

    // ────────────────────────────────────────────────
    // CRUD OPERATIONS
    // ────────────────────────────────────────────────

    const handleSaveProduct = async (data, isDraft) => {
        setFormLoading(true);
        try {
            if (editingProduct) {
                // UPDATE
                const { error } = await updateProduct(editingProduct.id, data);
                if (error) throw error;
                toast.success('Product updated!');
            } else {
                // CREATE
                const { error } = await createProduct(data);
                if (error) throw error;
                toast.success(isDraft ? 'Draft saved!' : 'Product published!');
            }
            setShowForm(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            toast.error(err.message || 'Failed to save product');
        }
        setFormLoading(false);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleView = (product) => {
        // Switch to detail view and select the product
        setActiveView('detail');
        localStorage.setItem('adminProductView', 'detail');
        setSelectedProduct(product);
    };

    const handleDuplicate = async (product) => {
        const cloneData = {
            nameEn: (product.nameEn || '') + ' (copy)',
            nameAr: product.nameAr || null,
            descriptionEn: product.descriptionEn || null,
            descriptionAr: product.descriptionAr || null,
            fullDescriptionEn: product.fullDescriptionEn || null,
            fullDescriptionAr: product.fullDescriptionAr || null,
            price: product.price,
            original_price: product.original_price,
            discount: product.discount,
            profit: product.profit,
            stock: product.stock,
            category_id: product.category_id,
            sizes: product.sizes,
            colors: product.colors,
            images: product.images,
            videoUrl: product.videoUrl,
            is_active: product.is_active,
            is_featured: product.is_featured,
            is_trending: product.is_trending,
        };

        const { error } = await createProduct(cloneData);
        if (error) {
            toast.error('Failed to duplicate product');
        } else {
            toast.success('Product duplicated!');
            loadProducts();
        }
    };

    const handleDeleteClick = (product) => {
        setDeleteTarget(product);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        const { error } = await deleteProduct(deleteTarget.id);
        if (error) {
            toast.error('Failed to delete product');
        } else {
            toast.success('Product deleted');
            if (selectedProduct?.id === deleteTarget.id) {
                setSelectedProduct(null);
            }
            loadProducts();
        }
        setDeleteTarget(null);
        setDeleteLoading(false);
    };

    const handleToggle = async (id, fieldName, currentValue) => {
        const { error } = await toggleProductStatus(id, fieldName, currentValue);
        if (error) {
            toast.error(`Failed to toggle ${fieldName}`);
        } else {
            toast.success(`${fieldName} toggled`);
            // Update local state immediately for responsiveness
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, [fieldName]: !currentValue } : p))
            );
            if (selectedProduct?.id === id) {
                setSelectedProduct((prev) => ({ ...prev, [fieldName]: !currentValue }));
            }
            // Refresh stats
            setAllProducts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, [fieldName]: !currentValue } : p))
            );
        }
    };

    // ────────────────────────────────────────────────
    // BULK ACTIONS
    // ────────────────────────────────────────────────

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) return;

        if (action === 'delete') {
            const promises = selectedIds.map((id) => deleteProduct(id));
            await Promise.all(promises);
            toast.success(`${selectedIds.length} products deleted`);
        } else if (action === 'activate') {
            const promises = selectedIds.map((id) => updateProduct(id, { is_active: true }));
            await Promise.all(promises);
            toast.success(`${selectedIds.length} products activated`);
        } else if (action === 'deactivate') {
            const promises = selectedIds.map((id) => updateProduct(id, { is_active: false }));
            await Promise.all(promises);
            toast.success(`${selectedIds.length} products deactivated`);
        }

        setSelectedIds([]);
        loadProducts();
    };

    // ────────────────────────────────────────────────
    // EXPORT CSV
    // ────────────────────────────────────────────────

    const handleExportCSV = () => {
        if (products.length === 0) {
            toast.error('No products to export');
            return;
        }

        const headers = ['Name', 'Price', 'Original Price', 'Stock', 'Category', 'Status', 'Rating'];
        const rows = products.map((p) => [
            p.nameEn,
            p.price,
            p.original_price || '',
            p.stock,
            p.Categories?.name_en || '',
            p.is_active ? 'Active' : 'Inactive',
            p.rating || '',
        ]);

        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products_export.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('CSV exported!');
    };

    // ────────────────────────────────────────────────
    // RENDER
    // ────────────────────────────────────────────────

    const sharedViewProps = {
        products,
        totalCount,
        currentPage,
        pageSize: PAGE_SIZE,
        onPageChange: setCurrentPage,
        onEdit: handleEdit,
        onView: handleView,
        onDuplicate: handleDuplicate,
        onDelete: handleDeleteClick,
    };

    return (
        <div className={styles.productsPage}>
            {/* Toolbar: search + filters + view switcher + add button */}
            <ProductsToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                categoryFilter={categoryFilter}
                onCategoryChange={handleCategoryChange}
                statusFilter={statusFilter}
                onStatusChange={handleStatusChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                activeView={activeView}
                onViewChange={handleViewChange}
                categories={categories}
                onAddProduct={() => { setEditingProduct(null); setShowForm(true); }}
                selectedCount={selectedIds.length}
                onBulkAction={handleBulkAction}
                onExportCSV={handleExportCSV}
            />

            {/* Stat bar */}
            <StatBar
                stats={stats}
                activeFilter={statusFilter}
                onStatClick={handleStatClick}
            />

            {/* Loading state */}
            {loading ? (
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading products...</p>
                </div>
            ) : (
                <>
                    {/* Active view */}
                    {activeView === 'table' && (
                        <TableView
                            {...sharedViewProps}
                            selectedIds={selectedIds}
                            onSelectId={handleSelectId}
                            onSelectAll={handleSelectAll}
                        />
                    )}

                    {activeView === 'grid' && (
                        <GridView
                            {...sharedViewProps}
                            onAddProduct={() => { setEditingProduct(null); setShowForm(true); }}
                        />
                    )}

                    {activeView === 'detail' && (
                        <DetailView
                            products={products}
                            selectedProduct={selectedProduct}
                            onSelectProduct={setSelectedProduct}
                            stats={stats}
                            onEdit={handleEdit}
                            onDuplicate={handleDuplicate}
                            onDelete={handleDeleteClick}
                            onToggle={handleToggle}
                        />
                    )}
                </>
            )}

            {/* Product Form (Add / Edit) */}
            <ProductForm
                isOpen={showForm}
                product={editingProduct}
                categories={categories}
                onSave={handleSaveProduct}
                onClose={() => { setShowForm(false); setEditingProduct(null); }}
                loading={formLoading}
            />

            {/* Delete confirmation */}
            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                productName={deleteTarget?.nameEn || ''}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteLoading}
            />
        </div>
    );
};

export default Products;
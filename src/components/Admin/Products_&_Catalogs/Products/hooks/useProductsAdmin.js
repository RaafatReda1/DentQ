import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { fetchProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } from '../../../../../services/productsService';
import { fetchCategories } from '../../../../../services/categoriesService';


const PAGE_SIZE = 20;

const getInitialView = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 'detail';
    return localStorage.getItem('adminProductView') || 'table';
};

/**
 * Custom hook to manage the business logic for the Products administration module.
 * Separates data fetching, filtering, and CRUD operations from the view.
 */
export const useProductsAdmin = () => {
    const { t } = useTranslation();
    const tp = (key, params = {}) => t(`admin.products.${key}`, params);

    // --- Data state ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // --- Filter / Search / Sort state ---
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState(0);

    // --- View mode ---
    const [activeView, setActiveView] = useState(getInitialView);

    // --- Selection state ---
    const [selectedIds, setSelectedIds] = useState([]);

    // --- Detail view: selected product ---
    const [selectedProduct, setSelectedProduct] = useState(null);

    // --- Form state ---
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // --- Delete modal state ---
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // --- Smart search data ---
    const [allProducts, setAllProducts] = useState([]);

    // --- Helpers ---
    const getAllDescendantIds = useCallback((parentId) => {
        if (!parentId) return [];
        const children = categories.filter((c) => c.parent_id === parentId);
        let ids = children.map((c) => c.id);
        for (const child of children) {
            ids = [...ids, ...getAllDescendantIds(child.id)];
        }
        return ids;
    }, [categories]);

    // --- Load Categories ---
    useEffect(() => {
        const loadCategories = async () => {
            const { data } = await fetchCategories();
            if (data) setCategories(data);
        };
        loadCategories();
    }, []);

    // --- Load Products ---
    const loadProducts = useCallback(async () => {
        setLoading(true);

        let categoryFilterValue = categoryFilter;
        if (categoryFilter) {
            const descendantIds = getAllDescendantIds(categoryFilter);
            categoryFilterValue = [categoryFilter, ...descendantIds];
        }

        const { data, count, error } = await fetchProducts({
            page: currentPage,
            limit: PAGE_SIZE,
            searchTerm: searchTerm,
            categoryId: categoryFilterValue,
        });

        if (error) {
            toast.error(tp('toast_load_fail'));
            setLoading(false);
            return;
        }

        let filtered = data || [];

        // Client-side status filtering
        if (statusFilter === 'active') filtered = filtered.filter((p) => p.is_active);
        else if (statusFilter === 'inactive') filtered = filtered.filter((p) => !p.is_active);
        else if (statusFilter === 'featured') filtered = filtered.filter((p) => p.is_featured);
        else if (statusFilter === 'trending') filtered = filtered.filter((p) => p.is_trending);
        else if (statusFilter === 'low_stock') filtered = filtered.filter((p) => p.stock <= 10);

        // Client-side sorting
        if (sortBy === 'price_asc') filtered.sort((a, b) => Number(a.price) - Number(b.price));
        else if (sortBy === 'price_desc') filtered.sort((a, b) => Number(b.price) - Number(a.price));
        else if (sortBy === 'name_asc') {
            filtered.sort((a, b) => (a.nameEn || '').localeCompare(b.nameEn || ''));
        }

        setProducts(filtered);
        setTotalCount(count || 0);
        setLoading(false);
    }, [currentPage, searchTerm, categoryFilter, statusFilter, sortBy, getAllDescendantIds]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        const loadAllProducts = async () => {
            const { data } = await fetchProducts({ page: 0, limit: 1000 });
            if (data) setAllProducts(data);
        };
        loadAllProducts();
    }, []);

    // Initial selection logic
    useEffect(() => {
        if (products.length > 0 && !selectedProduct) {
            setSelectedProduct(products[0]);
        }
    }, [products, selectedProduct]);

    // Stats calculation
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

    // Handlers
    const handleViewChange = (view) => {
        setActiveView(view);
        localStorage.setItem('adminProductView', view);
    };

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

    const handleSaveProduct = async (data, isPublish) => {
        setFormLoading(true);
        try {
            if (editingProduct) {
                const { error } = await updateProduct(editingProduct.id, data);
                if (error) throw error;
                toast.success(tp('toast_updated'));
            } else {
                const { error } = await createProduct(data);
                if (error) throw error;
                toast.success(isPublish ? tp('toast_published') : tp('toast_draft_saved'));
            }
            setShowForm(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            toast.error(tp('toast_save_fail'));
        }
        setFormLoading(false);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        const { error } = await deleteProduct(deleteTarget.id);
        if (error) {
            toast.error(tp('toast_delete_fail'));
        } else {
            toast.success(tp('toast_deleted'));
            if (selectedProduct?.id === deleteTarget.id) setSelectedProduct(null);
            loadProducts();
        }
        setDeleteTarget(null);
        setDeleteLoading(false);
    };

    const handleToggle = async (id, fieldName, currentValue) => {
        const { error } = await toggleProductStatus(id, fieldName, currentValue);
        if (error) {
            toast.error(tp('toast_toggle_fail'));
        } else {
            toast.success(`${fieldName} ${tp('toast_toggled')}`);
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, [fieldName]: !currentValue } : p))
            );
            if (selectedProduct?.id === id) {
                setSelectedProduct((prev) => ({ ...prev, [fieldName]: !currentValue }));
            }
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) return;
        setLoading(true);

        try {
            if (action === 'delete') {
                await Promise.all(selectedIds.map((id) => deleteProduct(id)));
                toast.success(`${selectedIds.length} ${tp('toast_bulk_deleted')}`);
            } else if (action === 'activate') {
                await Promise.all(selectedIds.map((id) => updateProduct(id, { is_active: true })));
                toast.success(`${selectedIds.length} ${tp('toast_bulk_activated')}`);
            } else if (action === 'deactivate') {
                await Promise.all(selectedIds.map((id) => updateProduct(id, { is_active: false })));
                toast.success(`${selectedIds.length} ${tp('toast_bulk_deactivated')}`);
            }
        } catch (err) {
            toast.error(tp('toast_bulk_fail'));
        }

        setSelectedIds([]);
        loadProducts();
    };

    const handleExportCSV = () => {
        if (products.length === 0) {
            toast.error(tp('toast_no_export'));
            return;
        }
        const headers = ['Name EN', 'Name AR', 'Price', 'Original Price', 'Stock', 'Status'];
        const rows = products.map((p) => [
            p.nameEn,
            p.nameAr || '',
            p.price,
            p.original_price || '',
            p.stock,
            p.is_active ? 'Active' : 'Inactive'
        ]);
        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_${Date.now()}.csv`;
        a.click();
        toast.success(tp('toast_csv_exported'));
    };

    return {
        products,
        categories,
        totalCount,
        loading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        activeView,
        handleViewChange,
        selectedIds,
        handleSelectId,
        handleSelectAll,
        selectedProduct,
        setSelectedProduct,
        showForm,
        setShowForm,
        editingProduct,
        setEditingProduct,
        formLoading,
        handleSaveProduct,
        deleteTarget,
        setDeleteTarget,
        deleteLoading,
        handleDeleteConfirm,
        allProducts,
        stats,
        handleToggle,
        handleBulkAction,
        handleExportCSV,
        PAGE_SIZE
    };
};

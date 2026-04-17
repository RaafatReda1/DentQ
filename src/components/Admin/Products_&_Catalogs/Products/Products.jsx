import React from 'react';
import { useTranslation } from 'react-i18next';

// Hooks
import { useProductsAdmin } from './hooks/useProductsAdmin';

// Sub-components
import ProductsToolbar from './components/ProductsToolbar/ProductsToolbar';
import StatBar from './components/StatBar/StatBar';
import TableView from './components/TableView/TableView';
import GridView from './components/GridView/GridView';
import DetailView from './components/DetailView/DetailView';
import ProductForm from './components/ProductForm/ProductForm';
import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
import Skeleton from './components/Skeleton/Skeleton';

import styles from './Products.module.css';

/**
 * Products — Main orchestrator component.
 * Now refactored to use useProductsAdmin hook for a cleaner,
 * more maintainable architecture.
 */
const Products = () => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);

    const {
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
    } = useProductsAdmin();

    return (
        <div className={styles.productsPage}>
            <ProductsToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                activeView={activeView}
                onViewChange={handleViewChange}
                categories={categories}
                allProducts={allProducts}
                onAddProduct={() => { setEditingProduct(null); setShowForm(true); }}
                selectedCount={selectedIds.length}
                onBulkAction={handleBulkAction}
                onExportCSV={handleExportCSV}
            />

            <StatBar
                stats={stats}
                activeFilter={statusFilter}
                onStatClick={setStatusFilter}
            />

            {loading ? (
                <div className={styles.skeletonGrid}>
                    {activeView === 'table' && <Skeleton variant="row" count={10} />}
                    {activeView === 'grid' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                            <Skeleton variant="card" count={8} />
                        </div>
                    )}
                    {activeView === 'detail' && (
                        <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
                            <div style={{ flex: 1, borderEnd: '1px solid var(--border-color)' }}>
                                <Skeleton variant="detail-list" count={6} />
                            </div>
                            <div style={{ flex: 2 }}>
                                <Skeleton variant="card" />
                                <Skeleton variant="text" count={4} />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {activeView === 'table' && (
                        <TableView
                            products={products}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            pageSize={PAGE_SIZE}
                            onPageChange={setCurrentPage}
                            selectedIds={selectedIds}
                            onSelectId={handleSelectId}
                            onSelectAll={handleSelectAll}
                            onEdit={productToEdit => { setEditingProduct(productToEdit); setShowForm(true); }}
                            onView={p => { setSelectedProduct(p); handleViewChange('detail'); }}
                            onDelete={setDeleteTarget}
                        />
                    )}

                    {activeView === 'grid' && (
                        <GridView
                            products={products}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            pageSize={PAGE_SIZE}
                            onPageChange={setCurrentPage}
                            onEdit={productToEdit => { setEditingProduct(productToEdit); setShowForm(true); }}
                            onDelete={setDeleteTarget}
                            onAddProduct={() => { setEditingProduct(null); setShowForm(true); }}
                        />
                    )}

                    {activeView === 'detail' && (
                        <DetailView
                            products={products}
                            selectedProduct={selectedProduct}
                            onSelectProduct={setSelectedProduct}
                            stats={stats}
                            onEdit={productToEdit => { setEditingProduct(productToEdit); setShowForm(true); }}
                            onDelete={setDeleteTarget}
                            onToggle={handleToggle}
                        />
                    )}
                </>
            )}

            <ProductForm
                isOpen={showForm}
                product={editingProduct}
                categories={categories}
                onSave={handleSaveProduct}
                onClose={() => { setShowForm(false); setEditingProduct(null); }}
                loading={formLoading}
            />

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